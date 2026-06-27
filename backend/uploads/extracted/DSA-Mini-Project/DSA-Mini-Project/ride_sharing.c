#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

typedef struct Point { int x; int y; } Point;

void addDriver(int driverId, Point location);
void updateDriverLocation(int driverId, Point newLocation);
void setDriverAvailability(int driverId, bool isAvailable);
int requestRide(int userId, Point pickup, Point destination);
void printDrivers(void);

/*
  Implementation notes:
  - Drivers stored in a dynamic array (simple DSA)
  - A BST is used to map driverId -> index in array (demonstrates BST usage)
  - A min-heap is used at request time to pick nearest driver (demonstrates heap)
  - A circular queue holds pending ride requests if no drivers available
  - A stack is used to produce a simple step-by-step route (x then y) when matched
*/

/* ---------- Driver storage ---------- */
typedef struct Driver {
    int id;
    Point loc;
    int available; /* 1 = available, 0 = busy */
} Driver;

static Driver *drivers = NULL;
static int drivers_count = 0;
static int drivers_capacity = 0;

static void ensure_capacity(void) {
    if (drivers_count >= drivers_capacity) {
        drivers_capacity = drivers_capacity ? drivers_capacity * 2 : 8;
        drivers = realloc(drivers, drivers_capacity * sizeof(Driver));
        if (!drivers) { perror("realloc"); exit(1); }
    }
}

/* ---------- BST for id -> index mapping (simple, not balanced) ---------- */
typedef struct BSTNode {
    int key; /* driverId */
    int index; /* index into drivers array */
    struct BSTNode *left, *right;
} BSTNode;

static BSTNode *bst_root = NULL;

static BSTNode* bst_create_node(int key, int index) {
    BSTNode *n = malloc(sizeof(BSTNode));
    n->key = key; n->index = index; n->left = n->right = NULL;
    return n;
}

static BSTNode* bst_insert_node(BSTNode *root, int key, int index) {
    if (!root) return bst_create_node(key,index);
    if (key < root->key) root->left = bst_insert_node(root->left, key, index);
    else if (key > root->key) root->right = bst_insert_node(root->right, key, index);
    else root->index = index; /* update */
    return root;
}

static int bst_find(BSTNode *root, int key) {
    while (root) {
        if (key == root->key) return root->index;
        if (key < root->key) root = root->left; else root = root->right;
    }
    return -1;
}

/* NOTE: we don't implement deletion from BST for simplicity in this demo */

/* ---------- Min-heap for selecting nearest driver ---------- */
typedef struct HeapItem {
    int index;    /* index in drivers[] */
    double dist;  /* precomputed distance to pickup */
} HeapItem;

typedef struct MinHeap {
    HeapItem *arr;
    int size;
    int cap;
} MinHeap;

static MinHeap* heap_create(int cap) {
    MinHeap *h = malloc(sizeof(MinHeap));
    h->arr = malloc(sizeof(HeapItem) * cap);
    h->size = 0; h->cap = cap;
    return h;
}
static void heap_push(MinHeap *h, HeapItem it) {
    if (h->size >= h->cap) {
        h->cap *= 2;
        h->arr = realloc(h->arr, sizeof(HeapItem) * h->cap);
    }
    int i = h->size++;
    h->arr[i] = it;
    /* sift up */
    while (i > 0) {
        int p = (i-1)/2;
        if (h->arr[p].dist <= h->arr[i].dist) break;
        HeapItem tmp = h->arr[p]; h->arr[p] = h->arr[i]; h->arr[i] = tmp;
        i = p;
    }
}
static HeapItem heap_pop(MinHeap *h) {
    HeapItem ret = h->arr[0];
    h->arr[0] = h->arr[--h->size];
    int i = 0;
    while (1) {
        int l = 2*i+1, r = 2*i+2, smallest = i;
        if (l < h->size && h->arr[l].dist < h->arr[smallest].dist) smallest = l;
        if (r < h->size && h->arr[r].dist < h->arr[smallest].dist) smallest = r;
        if (smallest == i) break;
        HeapItem tmp = h->arr[i]; h->arr[i] = h->arr[smallest]; h->arr[smallest] = tmp;
        i = smallest;
    }
    return ret;
}

/* ---------- Queue for pending requests ---------- */
typedef struct Request {
    int userId;
    Point pickup;
    Point dest;
} Request;

#define PENDING_CAP 64
static Request pending[PENDING_CAP];
static int pending_head = 0, pending_tail = 0, pending_size = 0;

static int queue_push(Request r) {
    if (pending_size >= PENDING_CAP) return 0;
    pending[pending_tail] = r;
    pending_tail = (pending_tail + 1) % PENDING_CAP;
    pending_size++;
    return 1;
}
static int queue_pop(Request *out) {
    if (pending_size == 0) return 0;
    *out = pending[pending_head];
    pending_head = (pending_head + 1) % PENDING_CAP;
    pending_size--;
    return 1;
}

/* ---------- Stack for route demonstration (simple) ---------- */
typedef struct RouteStep { int x; int y; } RouteStep;

typedef struct Stack {
    RouteStep *arr;
    int top;
    int cap;
} Stack;

static Stack* stack_create(int cap) {
    Stack *s = malloc(sizeof(Stack));
    s->arr = malloc(sizeof(RouteStep)*cap);
    s->top = 0; s->cap = cap;
    return s;
}
static void stack_push(Stack *s, RouteStep rs) {
    if (s->top >= s->cap) {
        s->cap *= 2; s->arr = realloc(s->arr, sizeof(RouteStep)*s->cap);
    }
    s->arr[s->top++] = rs;
}
static int stack_pop(Stack *s, RouteStep *out) {
    if (s->top == 0) return 0;
    *out = s->arr[--s->top]; return 1;
}

/* ---------- Helpers ---------- */
static double distance_to(Point a, Point b) {
    double dx = (double)(a.x - b.x);
    double dy = (double)(a.y - b.y);
    return sqrt(dx*dx + dy*dy);
}

/* If a driver becomes available, try to process pending queue */
static void try_process_pending(void);

/* ---------- Public API implementations ---------- */
void addDriver(int driverId, Point location) {
    ensure_capacity();
    /* add driver */
    drivers[drivers_count].id = driverId;
    drivers[drivers_count].loc = location;
    drivers[drivers_count].available = 1;
    /* map in BST */
    bst_root = bst_insert_node(bst_root, driverId, drivers_count);
    drivers_count++;
}

void updateDriverLocation(int driverId, Point newLocation) {
    int idx = bst_find(bst_root, driverId);
    if (idx < 0) {
        printf("No driver found with ID %d. Update ignored.\n", driverId); return;
    }
    drivers[idx].loc = newLocation;
}

void setDriverAvailability(int driverId, bool isAvailable) {
    int idx = bst_find(bst_root, driverId);
    if (idx < 0) { printf("No driver found with ID %d. Availability change ignored.\n", driverId); return; }
    drivers[idx].available = isAvailable ? 1 : 0;
    if (isAvailable) {
        /* try to assign any pending requests */
        try_process_pending();
    }
}

int requestRide(int userId, Point pickup, Point destination) {
    /* build min-heap of available drivers */
    MinHeap *h = heap_create(8);
    for (int i = 0; i < drivers_count; ++i) {
        if (!drivers[i].available) continue;
        HeapItem it;
        it.index = i;
        it.dist = distance_to(drivers[i].loc, pickup);
        heap_push(h, it);
    }
    if (h->size == 0) {
        /* no drivers available -> enqueue request */
        Request r = { .userId = userId, .pickup = pickup, .dest = destination };
        if (!queue_push(r)) {
            printf("No drivers are available and the pending queue is full. Your request could not be queued. Please try again later.\n");
            free(h->arr); free(h);
            return -1;
        }
        printf("No drivers are available right now. Your request has been queued and will be assigned when a driver becomes available.\n");
        free(h->arr); free(h);
        return -1;
    }

    /* pick nearest */
    HeapItem best = heap_pop(h);
    int didx = best.index;
    int driverId = drivers[didx].id;
    drivers[didx].available = 0; /* mark busy */

    printf("Assigned driver %d to user %d (distance %.2f).\n", driverId, userId, best.dist);

    /* produce a simple route: move in X, then Y. We'll push steps onto a stack and then pop to print forward route. */
    Point cur = drivers[didx].loc;
    Stack *s = stack_create(8);
    /* steps from driver -> pickup */
    int dx = pickup.x - cur.x;
    int step = (dx >= 0) ? 1 : -1;
    for (int i = cur.x; i != pickup.x; i += step) {
        RouteStep rs = { i + step, cur.y };
        stack_push(s, rs);
    }
    int dy = pickup.y - cur.y;
    step = (dy >= 0) ? 1 : -1;
    for (int j = cur.y; j != pickup.y; j += step) {
        RouteStep rs = { pickup.x, j + step };
        stack_push(s, rs);
    }
    /* steps from pickup -> dest */
    cur = pickup;
    dx = destination.x - cur.x;
    step = (dx >= 0) ? 1 : -1;
    for (int i = cur.x; i != destination.x; i += step) {
        RouteStep rs = { i + step, cur.y };
        stack_push(s, rs);
    }
    dy = destination.y - cur.y;
    step = (dy >= 0) ? 1 : -1;
    for (int j = cur.y; j != destination.y; j += step) {
        RouteStep rs = { destination.x, j + step };
        stack_push(s, rs);
    }

    printf("Planned route steps (driver -> pickup -> destination):\n");
    /* pop stack to print in forward order */
    RouteStep rs;
    /* to print forward we need to reverse stack: we'll pop all into a temporary array then print reversed */
    int total = s->top;
    RouteStep *tmp = malloc(sizeof(RouteStep) * total);
    int ti = 0;
    while (stack_pop(s, &rs)) tmp[ti++] = rs;
    /* currently tmp contains steps in reverse (last step is at tmp[0]) - we want forward: print from tmp[ti-1] down to tmp[0] */
    for (int k = ti-1; k >= 0; --k) {
        printf("  (%d,%d)\n", tmp[k].x, tmp[k].y);
    }

    /* update driver's location to destination (ride finished) for simplicity */
    drivers[didx].loc = destination;

    free(tmp);
    free(s->arr); free(s);
    free(h->arr); free(h);

    return driverId;
}

void printDrivers(void) {
    printf("Drivers (%d):\n", drivers_count);
    for (int i = 0; i < drivers_count; ++i) {
        printf("  id=%d loc=(%d,%d) %s\n", drivers[i].id, drivers[i].loc.x, drivers[i].loc.y, drivers[i].available?"AVAILABLE":"BUSY");
    }
}

/* Process pending queue: try to match each queued request if any driver is available.
   We will attempt to match repeatedly while there are available drivers and pending requests. */
static void try_process_pending(void) {
    if (pending_size == 0) return;
    /* simple loop: try to match as many as possible */
    int served = 0;
    for (int attempt = 0; attempt < PENDING_CAP && pending_size > 0; ++attempt) {
        /* peek first pending request */
        Request r = pending[pending_head];
        /* try to find an available driver quickly (linear scan) */
        int best_idx = -1; double best_dist = 0.0;
        for (int i = 0; i < drivers_count; ++i) {
            if (!drivers[i].available) continue;
            double d = distance_to(drivers[i].loc, r.pickup);
            if (best_idx < 0 || d < best_dist) { best_idx = i; best_dist = d; }
        }
        if (best_idx < 0) break; /* still no drivers */
        /* match */
    drivers[best_idx].available = 0;
    printf("(From queue) Assigned driver %d to user %d (distance %.2f).\n", drivers[best_idx].id, r.userId, best_dist);
        /* pop queue */
        Request popped;
        queue_pop(&popped);
        served++;
        /* for simplicity mark driver at destination immediately */
        drivers[best_idx].loc = r.dest;
    }
    if (served) printf("Processed %d pending request(s) from the queue.\n", served);
}

/* ---------- Demo main ---------- */
#ifdef DEMO_RIDE_SHARING
int main(void) {
    addDriver(101, (Point){0,0});
    addDriver(37, (Point){5,2});
    addDriver(9, (Point){-2,4});
    printDrivers();

    Point pickup = {1,1};
    Point dest = {8,8};
    int matched = requestRide(501, pickup, dest);
    if (matched > 0) printf("Driver %d assigned.\n", matched);

    printDrivers();

    /* mark driver 9 available and then place another request */
    setDriverAvailability(9, 1);
    requestRide(502, (Point){-1,3}, (Point){0,0});

    printDrivers();
    return 0;
}
#endif
