Nodejs-BullMrQ
This is demo Project for upload Image in our local folder. And use bullMQ.  
BullMQ is a lightweight, robust, and fast NodeJS library for creating background jobs and sending messages using queues

Main file is app.ts
POST http://localhost:3000/api/upload /* upload image */
POST http://localhost:3000/api/retry-failed /* failed job are again sending for this route */
POST http://localhost:3000/api/clean-failed /* clean all jobs of failed */

GET http://localhost:3000/admin/queues/ /* For Access bullMQ dashboard on browser */
