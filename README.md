# UDE Video Library

## What is this project for?

This Video Library serves as a collaborative tool for students and professors to share lectures and provide feedback.

## Motivation behind this project

This project was built for the WebTech course, Duisburg-Essen University.

## Group members

Jan Eickholt, Kevin Bouten, Pierre-Maurice Merckel, Elias Bugil, Tim Witzdam

## Architecture

This project is built on the MERN stack.
For deployment it uses Docker and the preview instance is deployed on a Linux VPS.

## How to run

Create a `.env` in the root folder containing `JWT_SECRET`, `MONGO_URL` (provided by us in the final submission), a video and image file path `FILE_PATH` (when using it with docker this must be "/app/media"), as well as a `VITE_BACKEND_URL`.
Create a `.env` in the frontend folder containing `VITE_BACKEND_URL` and `VITE_COOKIE_DOMAIN` (for local testing that's just "localhost").

Setup docker and run `docker-compose up -d`
