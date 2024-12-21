<template>
  <div>
    <br>
  </div>
</template>

<script setup>
const form = TrueForm({
  email: {
    name: 'test',
    rules: 'required',
    default: 'ali',
  },
  password: {
    name: 'password',
    rules: 'required',
    default: '',
  },
})
console.log(form)
</script>
