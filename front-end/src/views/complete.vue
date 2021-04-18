<template>
<div>
  <h1>Completed</h1>
  <div v-for="patient in completed" v-bind:key="patient.id">
    <hr>
    <div>
      <div>
        <h2>{{patient.name}}</h2>
        <p>Diagnosis: {{patient.condition}}</p>
        <p>Treatment: {{patient.treatment}}</p>
        <p>Doctor: Dr. {{patient.doctor}}</p>
      </div>
      <button @click="deleteCompleted(patient)">Delete</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Complete',
  data() {
    return {
      completed: [],
      doctor: '',
    }
  },
  created() {
    this.getCompleted();
  },
  methods: {
    async getCompleted() {
      try {
        let response = await axios.get("/api/completed");
        this.completed = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCompleted(patient) {
      try {
        await axios.delete("/api/completed/" + patient._id);
        this.getCompleted();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getDoctor(patient) {
      try {
        let id = patient.user;
        let response = await axios.get("/api/users/" + id);
        this.doctor = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    getDocName: function(patient) {
      this.getDoctor(patient);
      return this.doctor.firstName + " " + this.doctor.lastName;
    },
  }
}
</script>
