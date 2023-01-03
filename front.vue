<template>
  <div>
    <h1>Donation Dashboard</h1>
    <p>Welcome, {{ user.name }}</p>
    <p>Your current donation balance is {{ user.balance }}</p>
    <h2>Make a Donation</h2>
    <form @submit.prevent="makeDonation">
      <label for="recipient">Recipient</label>
      <select v-model="recipient">
        <option v-for="member in team" :value="member.id">{{ member.name }}</option>
      </select>
      <label for="amount">Amount</label>
      <input type="number" v-model.number="amount" />
      <label for="message">Message</label>
      <textarea v-model="message"></textarea>
      <button type="submit">Submit</button>
    </form>
    <h2>Previous Donations</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Sender</th>
          <th>Recipient</th>
          <th>Amount</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="donation in donations">
          <td>{{ donation.date }}</td>
          <td>{{ donation.sender }}</td>
          <td>{{ donation.recipient }}</td>
          <td>{{ donation.amount }}</td>
          <td>{{ donation.message }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { invokeLambda } from 'aws-sdk';

export default {
  data() {
    return {
      user: null,
      team: [],
      recipient: '',
      amount: 0,
      message: '',
      donations: []
    }
  },
  created() {
    this.getUser();
    this.getTeam();
    this.getDonations();
  },
  methods: {
    async getUser() {
      const result = await invokeLambda({
        FunctionName: 'getUser',
        Payload: JSON.stringify({
          userId: this.$route.params.userId
        })
      }).promise();
      this.user = JSON.parse(result.Payload);
    },
    async getTeam() {
      const result = await invokeLambda({
        FunctionName: 'getTeam'
      }).promise();
      this.team = JSON.parse(result.Payload);
    },
    async getDonations() {
      const result = await invokeLambda({
        FunctionName: 'getDonations'
      }).promise();
      this.donations = JSON.parse(result.Payload);
    },
    async makeDonation() {
      try {
        await invokeLambda({
          FunctionName: 'makeDonation',
          Payload: JSON.stringify({
            sender: this.user.id,
            recipient: this.recipient,
            amount: this.amount,
            message: this.message
          })
        }).promise();
        this.recipient = '';
        this.amount = 0;
        this.message = '';
        this.getUser();
        this.getDonations();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>