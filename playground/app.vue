<template>
  <div>
    <input
      v-model="form.email.data"
      type="text"
    > <br />
    <input
      v-model="form.password.data"
      type="text"
    >
    <br>
    <pre>{{ form }}</pre>
  </div>
</template>

<script setup>
const form = TrueForm({
  email: {
    name: 'test',
    rules: ['required', 'email', function () {
      return { status: 0, message: 'The :attribute: is for test! but: ' + form.password.data }
    }],
    default: 'ali',
  },
  password: {
    name: 'password',
    rules: { 'required', },
    default: '',
  },
})
</script>
