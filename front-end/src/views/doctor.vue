<template>
<div>
  <div>
    <h1>Doctor Currently In</h1>
    <div v-if="user">
      <h2>Dr. {{user.firstName}} {{user.lastName}}</h2>
      <button @click="logout()">Logout</button>
    </div>
    <div v-else>
      <h3>None</h3>
    </div>
  </div>
  <div>
    <hr>
    <h1>Doctor Register</h1>
    <input v-model="firstName" placeholder="First Name">
    <p></p>
    <input v-model="lastName" placeholder="Last Name">
    <p></p>
    <input v-model="username" placeholder="Username">
    <p></p>
    <input type="password" v-model="password" placeholder="Password">
    <br />
    <button @click="register()">Register</button>
    <br>
    <hr>
    <h1>Doctor Login</h1>
    <input v-model="userLogin" placeholder="Username">
    <p></p>
    <input type="password" v-model="passLogin" placeholder="Password">
    <br />
    <button @click="login()">Login</button>
  </div>

</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Doctor',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      userLogin: '',
      passLogin: '',
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async register() {
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post("/api/users", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password
        });
        this.$root.$data.user = response.data.user;
        this.firstName = "";
        this.lastName = "";
        this.username = "";
        this.password = "";
        return true;
      } catch (error) {
        console.log(error);
      }

    },
    async login() {
      if (!this.userLogin || !this.passLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.userLogin,
          password: this.passLogin,
        });
        this.userLogin = "";
        this.passLogin = "";
        this.$root.$data.user = response.data.user;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        return true;
      } catch (error) {
        this.$root.$data.user = null;
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
input {
  font-size: 1.2em;
  height: 30px;
  width: 200px;
}

textarea {
  font-size: 1.6em;
  width: 100%;
  max-width: 500px;
  height: 100px;
}

button {
  margin-top: 20px;
  font-size: 1.2em;
}
</style>
