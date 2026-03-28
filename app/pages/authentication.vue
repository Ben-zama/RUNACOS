<template>
  <div id="authPage">
    <div class="auth-wrapper">
      
      <div class="brand-header">
        <div class="logo-icon"><img src="~/assets/logo.png" alt="Logo"/></div>
        <h2>RUNACOS Portal</h2>
        <p>{{ isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to access the portal.' }}</p>
      </div>

      <div class="glass-card auth-card">
        
        <div class="tab-switcher">
          <button 
            :class="{ active: isLogin }" 
            @click="isLogin = true"
            type="button"
          >
            Login
          </button>
          <button 
            :class="{ active: !isLogin }" 
            @click="isLogin = false"
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          
          <div v-show="!isLogin" class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <i class="bi bi-person"></i>
              <input id="username" v-model="form.username" type="text" placeholder="johndoe" class="glass-input" :required="!isLogin" />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <i class="bi bi-envelope"></i>
              <input id="email" v-model="form.email" type="email" placeholder="you@run.edu.ng" class="glass-input" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <i class="bi bi-lock"></i>
              <input id="password" v-model="form.password" type="password" placeholder="••••••••" class="glass-input" required />
            </div>
          </div>

          <template v-if="!isLogin">
            <div class="form-group">
               <label>I am registering as a:</label>
               <div class="role-selector">
                  <label>
                    <input type="radio" v-model="form.role" value="student">
                    Student
                  </label>
                  <label>
                    <input type="radio" v-model="form.role" value="alumni">
                    Alumni
                  </label>
               </div>
            </div>

            <div v-if="form.role === 'student'" class="form-row">
              <div class="form-group half">
                <label for="department">Department</label>
                <select id="department" v-model="form.studentInfo.department" class="glass-input glass-select" :required="form.role === 'student'">
                  <option value="" disabled>Select Dept</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Information Technology">Information Tech</option>
                </select>
              </div>

              <div class="form-group half">
                <label for="matric">Matric Number</label>
                <div class="input-wrapper">
                  <i class="bi bi-card-text"></i>
                  <input id="matric" v-model="form.studentInfo.matricNumber" type="text" placeholder="RUN/CSC/..." class="glass-input" :required="form.role === 'student'" />
                </div>
              </div>
            </div>

            <div v-if="form.role === 'alumni'" class="form-row">
               <div class="form-group half">
                <label for="gradYear">Graduation Year</label>
                <div class="input-wrapper">
                  <i class="bi bi-calendar"></i>
                  <input id="gradYear" v-model="form.alumniInfo.graduationYear" type="text" placeholder="e.g. 2023" class="glass-input" />
                </div>
              </div>

              <div class="form-group half">
                <label for="jobTitle">Job Title</label>
                <div class="input-wrapper">
                  <i class="bi bi-briefcase"></i>
                  <input id="jobTitle" v-model="form.alumniInfo.jobTitle" type="text" placeholder="Software Engineer" class="glass-input" />
                </div>
              </div>
            </div>
          </template>

          <div v-if="authStore.authError" class="error-message">
            <i class="bi bi-exclamation-circle"></i> {{ authStore.authError }}
          </div>

          <button type="submit" class="glass-btn submit-btn" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading" class="spinner"><i class="bi bi-arrow-repeat spin"></i></span>
            {{ authStore.isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
          </button>
          
        </form>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'

definePageMeta({
    layout: 'empty',
})

const authStore = useAuthStore()
const isLogin = ref(true)

// Centralized form state
const form = reactive({
  username: '',
  email: '',
  password: '', 
  role: 'student', // default role
  studentInfo: {
    department: '',
    matricNumber: ''
  },
  alumniInfo: {
    graduationYear: '',
    jobTitle: '',
    currentCompany: '',
    isStar: false
  }
})

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // --- LOGIN FLOW ---
      await authStore.login({
        email: form.email,
        password: form.password
      })
      alert('Login successful!')
      // Redirect to dashboard
      // navigateTo('/dashboard')
      
    } else {
      // --- SIGNUP FLOW ---
      // 1. Build the base payload WITH the password
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      }

      if (form.role === 'student') {
         payload.studentInfo = {
            department: form.studentInfo.department,
            matricNumber: form.studentInfo.matricNumber
         }
      } else if (form.role === 'alumni') {
         payload.alumniInfo = {
            graduationYear: form.alumniInfo.graduationYear,
            jobTitle: form.alumniInfo.jobTitle,
            currentCompany: form.alumniInfo.currentCompany,
            isStar: form.alumniInfo.isStar
         }
      }
      
      // 3. Send it!
      await authStore.signup(payload)
      alert('Account created successfully! Please log in.')
      
      // Automatically switch to the login tab after successful signup
      isLogin.value = true
      form.password = '' // Clear the password field for safety
    }
  } catch (err) {
    console.error('Auth error:', err)
  }
}
</script>

<style lang="scss" scoped>

#authPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #fff;
  padding: 20px;
  font-family: inherit;

  @mixin glass-panel {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
  }

  .auth-wrapper {
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .brand-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .logo-icon {
      width: 75px;
      height: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff, #c1c0c0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      margin: 0;
      color: #8a8a93;
      font-size: 0.95rem;
    }
  }

  .auth-card {
    @include glass-panel;
    padding: 30px;
  }

  .tab-switcher {
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 5px;
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    button {
      flex: 1;
      background: transparent;
      border: none;
      color: #8a8a93;
      padding: 10px 0;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-row {
    display: flex;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.half { flex: 1; }

    label {
      font-size: 0.85rem;
      color: #ccc;
      font-weight: 500;
      margin-left: 5px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: 15px;
        color: #8a8a93;
        font-size: 1.1rem;
      }

      .glass-input { padding-left: 45px; }
    }

    .glass-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 14px 15px;
      border-radius: 12px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s, background 0.3s;

      &::placeholder { color: rgba(138, 138, 147, 0.5); }
      &:focus { 
        border-color: $accent-color; 
        background: rgba(0, 0, 0, 0.4); 
      }
    }

    select.glass-select {
      appearance: none;
      cursor: pointer;
      background-image: url('data:image/svg+xml;utf8,<svg fill="%238a8a93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
      background-repeat: no-repeat;
      background-position-x: 95%;
      background-position-y: 50%;
      option { color: #000; }
    }
  }

  /* Added Role Selector Styles */
  .role-selector {
    display: flex;
    gap: 15px;
    margin-top: 5px;
    
    label {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #fff;
    }
  }

  .error-message {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 71, 87, 0.2);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .submit-btn {
    margin-top: 10px;
    width: 100%;
    background: $accent-color;
    border: none;
    color: #fff;
    padding: 15px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s, transform 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spin {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    .auth-wrapper { max-width: 100%; }
    .form-row { flex-direction: column; gap: 20px; }
  }
}
</style>