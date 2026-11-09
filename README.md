# NEUB CSE Management App
Professional React + Firebase + Capacitor Project

Overview-
The NEUB CSE Management App is a centralized academic management system built for the Department of Computer Science and Engineering at North East University Bangladesh.
It provides role-based dashboards for students, teachers, and admins, with secure authentication and real-time data management.


Included Features-
Interface
Professional home page and responsive design
Hamburger menu for navigation
Authentication
Real email login and registration
Account recovery system
Student registration with year and semester
Teacher/Admin registration with secret code
Student Dashboard
Semester-based access to notices, routines, materials, and assignments
Payment status tracking with email verification
Personal activity log
Teacher Dashboard
Create, edit, and publish assignments
Upload lecture materials (PDFs, slides, notes)
Manage student submissions
Admin Dashboard
Full monitoring and control center
Add, edit, and view semester and society payments
Manage users, routines, and notices
Academic Modules
Notices
Class Routine
Materials
Assignments
Submissions
Activity Tracking
Technologies Used
Frontend: React
Backend: Firebase Firestore
Authentication: Firebase Auth
Android Integration: Capacitor
Security: Firestore Rules
Security Highlights
Role-based access control
Secret code verification for teachers and admins
Email confirmation for payments
Firestore security rules for data protection
Android Setup

## Run

```powershell
npm install
npm run dev
```


live link:

https://neub-cse-management.onrender.com/



## Convert to Android

```powershell
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Conclusion
The NEUB CSE Management App enhances efficiency, transparency, and security across academic operations.
It is a complete professional solution for modern university management.
```
