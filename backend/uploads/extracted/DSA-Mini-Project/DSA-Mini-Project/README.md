Ride-Sharing Service Simulation (C, DSA mini-project)

Overview
--------
This is a small, educational ride-sharing service simulator written in C. It demonstrates use of classical data structures (BST, min-heap, queue, stack) to implement core operations:

- addDriver(driverId, location)
- updateDriverLocation(driverId, newLocation)
- setDriverAvailability(driverId, isAvailable)
- requestRide(userId, pickupLocation, destination)

Design
------
- Drivers are stored in a dynamic array.
- A simple (unbalanced) BST maps driverId -> index for O(log n) average lookups.
- A min-heap is built at request time to pick the nearest available driver (demonstrates heap usage).
- A circular queue stores pending ride requests when no drivers are available.
- A stack demonstrates constructing/printing a step-by-step route.

Build and run
-------------
Requires a C compiler (gcc). From the project folder run:

```powershell
# build
mingw32-make   # or 'make' if using MSYS/WSL or if make is available

# or directly with gcc
gcc -std=c11 -O2 -Wall -Wextra -o ride_sharing.exe ride_sharing.c main.c

# run
.\ride_sharing.exe
```

Files
-----
- `ride_sharing.h` - public API header
- `ride_sharing.c` - implementation (drivers array, BST, heap, queue, stack)
- `main.c` - small demo that uses the API
- `Makefile` - simple build helper

Next steps / Extensions
-----------------------
- Replace the unbalanced BST with an AVL tree for guaranteed O(log n) id lookups.
- Use a spatial data structure (KD-tree) for faster nearest-driver queries.
- Persist drivers to a file or add a command-line interactive shell.

Interactive usage
-----------------
After building, run `ride_sharing.exe`. A simple interactive menu will appear allowing you to:

- Add drivers: provide `driverId x y`
- Update driver location: `driverId x y`
- Set availability: `driverId isAvailable(1/0)`
- Request ride: `userId pickupX pickupY destX destY`
- Print drivers

You can also automate scenarios by piping input from a text file into the program on Windows PowerShell:

```powershell
.\ride_sharing.exe < sample_input.txt
```

`sample_input.txt` can contain sequence of menu choices and arguments separated by whitespace/newlines. A sample file is included in the repo.


