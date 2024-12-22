<template>
  <div>
    <input
    v-model="form.password.data"
    >
    <br>
    <input
    v-model="form.confirmPassword.data"
    >
    <br>
    <pre>{{ form }}</pre>

    <br><br><br><br>
    <input
    v-model="form2.password.data"
    >
    <br>
    <input
    v-model="form2.confirmPassword.data"
    >
    <br>
    <pre>{{ form2 }}</pre>
  </div>
</template>

<script setup>
const form = TrueForm({
  password: {
    name: 'SALAM PASSWORD',
    rules: ['unload', function (val, otherProps) {
      return {
        status: 1,
        message: 'this is for test'
      }
    }],
    default: '',
  },
  confirmPassword: {
    name: 'Confirm Password',
    rules: 'unload|required|_same:password',
    default: '',
  },
})

const form2 = TrueForm({
  password: {
    name: 'SALAM PASSWORD',
    rules: ['unload', function (val, otherProps) {
      return {
        status: 1,
        message: 'this is for test'
      }
    }],
    default: '',
  },
  confirmPassword: {
    name: 'Confirm Password',
    rules: 'unload|required|_same:password',
    default: '',
  },
})
</script>
