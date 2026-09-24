# AI Usage Report

## Project

Smart Timetable Generator

## Assignment

Edumerge Solutions – Pre-Drive Product Engineering Assignment

**Selected Assignment:** Assignment 3 – Intelligent Timetable Generator

## AI Tool Used

**ChatGPT**

ChatGPT was used as a development assistant throughout the project for planning, implementation support, debugging, and documentation.

## 1. Architecture and Planning

AI assistance was used to break the assignment into major components:

- React frontend
- Express backend
- MongoDB database
- REST APIs
- Constraint-based scheduling engine
- Timetable visualization

This helped structure the application into separate frontend, backend, model, controller, route, and scheduler components.

## 2. Database Design

AI assistance was used to plan the main database entities:

- Faculty
- Subject
- Room
- Division

The schemas were then implemented using Mongoose and tested against MongoDB Atlas.

## 3. Backend Development

AI assistance was used for implementation support for:

- Express server setup
- REST API routes
- Controllers
- Mongoose models
- MongoDB connection
- Timetable generation endpoint

The APIs were tested locally using the application and PowerShell requests.

## 4. Scheduling Algorithm

AI assistance was used to structure the constraint-based timetable generation approach.

The scheduler checks:

- Faculty availability
- Faculty collisions
- Division collisions
- Room collisions
- Room capacity
- Laboratory room requirements
- Required subject hours

The generated timetable was tested with the configured sample data.

### Test Result

```text
Scheduled classes: 6
Conflicts: 0