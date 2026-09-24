# Smart Timetable Generator

A full-stack intelligent timetable generation system that automatically creates academic schedules while respecting faculty availability, room constraints, division constraints, subject requirements, and laboratory requirements.

## Assignment

**Edumerge Solutions – Pre-Drive Product Engineering Assignment**

### Selected Assignment

**Assignment 3 – Intelligent Timetable Generator**

## Features

- Faculty management
- Faculty teaching availability selection
- Subject management
- Faculty-subject association
- Classroom and laboratory management
- Academic division management
- Automatic timetable generation
- Constraint-based scheduling
- Faculty collision prevention
- Division collision prevention
- Room collision prevention
- Room capacity validation
- Laboratory room validation
- Weekly timetable visualization
- Conflict reporting
- MongoDB persistence
- REST API architecture

## Technology Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools
- Git
- GitHub
- VS Code
- PowerShell for API testing

## System Architecture

```text
                    React Frontend
                         |
                       Axios
                         |
                         v
                  Express REST API
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
       Faculty        Subjects        Rooms
          |              |              |
          +--------------+--------------+
                         |
                         v
                     Divisions
                         |
                         v
              Constraint Scheduler
                         |
                         v
               Generated Timetable