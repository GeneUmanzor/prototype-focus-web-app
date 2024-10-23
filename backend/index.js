const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig'); //import firebase configuration

//ini. firebase
firebase.initializeApp({
  credential: firebase.credential.cert(firebseConfig),
  databaseURL: "https://your-project-id.firebaseio.com"

});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = firebase.firestore();

//get tasks
app.get('/tasks', async (req, res) => {
  try{
    const tasksSnapshot = await db.colletion('tasks').get();
    let tasks = [];
    tasksSnapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//add new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = req.body;
    const taskRef = await db.collection('tasks').add(newTask);
    res.status(201).json({ id: taskRef.id });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await db.collections('tasks').doc(req.params.id).delete();
    res.status(200).send('Task Deleted');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Serverrunning on port ${port}');
});
