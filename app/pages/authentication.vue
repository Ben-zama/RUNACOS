<template>
  <div id="authPage">
    <Toast position="top-right" />

    <div class="auth-wrapper">
      <div class="brand-header">
        <div class="logo-icon"><img src="~/assets/logo.png" alt="Logo" /></div>
        <h2>RUNACOS Portal</h2>
        <p>
          {{
            isLogin
              ? "Welcome back! Please enter your details."
              : "Create an account to access the portal."
          }}
        </p>
      </div>

      <div class="glass-card auth-card">
        <div class="tab-switcher">
          <button
            :class="{ active: isLogin }"
            @click="switchTab(true)"
            type="button"
          >
            Login
          </button>
          <button
            :class="{ active: !isLogin }"
            @click="switchTab(false)"
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-show="!isLogin" class="form-group">
            <label for="username">Full name</label>
            <span class="p-input-icon-left w-full">
              <i class="bi bi-person pl-3"></i>
              <InputText
                id="username"
                v-model="form.username"
                placeholder="John Doe"
                class="glass-input w-full pl-5"
                :required="!isLogin"
              />
            </span>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <span class="p-input-icon-left w-full">
              <i class="bi bi-envelope pl-3"></i>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@run.edu.ng"
                class="glass-input w-full pl-5"
                :class="{ 'p-invalid': emailError }"
                required
                @input="validateEmail"
              />
            </span>
            <small v-if="emailError" class="p-error">{{ emailError }}</small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-wrapper w-full">
              <i class="bi bi-lock absolute-icon"></i>
              <Password
                id="password"
                v-model="form.password"
                placeholder="••••••••"
                class="glass-password w-full"
                inputClass="glass-input w-full pl-5"
                :feedback="false"
                toggleMask
                :class="{ 'p-invalid': passwordError }"
                required
                @input="validatePassword"
              />
            </div>
            <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
          </div>

          <template v-if="!isLogin">
            <div class="form-group mt-2">
              <label>I am registering as a:</label>
              <div class="role-selector">
                <div class="flex align-items-center gap-2 cursor-pointer">
                  <RadioButton v-model="form.role" inputId="roleStudent" name="role" value="student" />
                  <label for="roleStudent" class="cursor-pointer mb-0">Student</label>
                </div>
                <div class="flex align-items-center gap-2 cursor-pointer ml-3">
                  <RadioButton v-model="form.role" inputId="roleAlumni" name="role" value="alumni" />
                  <label for="roleAlumni" class="cursor-pointer mb-0">Alumni</label>
                </div>
              </div>
            </div>

            <div v-if="form.role !== 'admin'" class="form-row mt-2">
              <div class="form-group half">
                <label for="department">Department</label>
                <Dropdown
                  id="department"
                  v-model="form.studentInfo.department"
                  :options="departments"
                  placeholder="Select Dept"
                  class="glass-input w-full dropdown-override"
                  required
                />
              </div>

              <div class="form-group half">
                <label for="matric">Matric Number</label>
                <span class="p-input-icon-left w-full">
                  <i class="bi bi-card-text pl-2"></i>
                  <InputText
                    id="matric"
                    v-model="form.studentInfo.matricNumber"
                    placeholder="RUN/CMP/..."
                    class="glass-input w-full pl-5"
                    required
                  />
                </span>
              </div>
            </div>

            <div v-if="form.role === 'alumni'" class="form-row">
              <div class="form-group half">
                <label for="gradYear">Graduation Year</label>
                <span class="p-input-icon-left w-full">
                  <i class="bi bi-calendar pl-2"></i>
                  <InputText
                    id="gradYear"
                    v-model="form.alumniInfo.graduationYear"
                    placeholder="e.g. 2023"
                    class="glass-input w-full pl-5"
                    maxlength="4"
                    keyfilter="int"
                  />
                </span>
              </div>

              <div class="form-group half">
                <label for="jobTitle">Job Title</label>
                <span class="p-input-icon-left w-full">
                  <i class="bi bi-briefcase pl-2"></i>
                  <InputText
                    id="jobTitle"
                    v-model="form.alumniInfo.jobTitle"
                    placeholder="Software Engineer"
                    class="glass-input w-full pl-5"
                  />
                </span>
              </div>
            </div>
          </template>

          <div v-if="authStore.authError" class="error-message">
            <i class="bi bi-exclamation-circle"></i> {{ authStore.authError }}
          </div>

          <Button
            type="submit"
            :label="isLogin ? 'Sign In' : 'Create Account'"
            class="submit-btn"
            :loading="authStore.isLoading"
            :disabled="hasErrors"
          />
        </form>

        <NuxtLink to="/" class="back-link">
          <i class="bi bi-house-door"></i> Back to homepage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "~/stores/useAuthStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "empty",
});

const authStore = useAuthStore();
const toast = useToast();
const isLogin = ref(true);

// Validation States
const emailError = ref("");
const passwordError = ref("");

// Dropdown Options
const departments = ["Computer Science", "Cyber Security", "Information Technology"];

const form = reactive({
  username: "",
  email: "",
  password: "",
  role: "student",
  studentInfo: {
    department: "",
    matricNumber: "",
  },
  alumniInfo: {
    graduationYear: "",
    jobTitle: "",
    currentCompany: "",
    isStar: false,
  },
});

const switchTab = (toLogin) => {
  isLogin.value = toLogin;
  emailError.value = "";
  passwordError.value = "";
  authStore.authError = null;
};

// --- Real-time Validation ---
const validateEmail = () => {
  if (!form.email) {
    emailError.value = "Email is required";
/*   } else if (!form.email.toLowerCase().endsWith("@run.edu.ng")) {
    emailError.value = "Email must end with @run.edu.ng"; */
  } else {
    emailError.value = "";
  }
};

const validatePassword = () => {
  if (!form.password) {
    passwordError.value = "Password is required";
  } else if (form.password.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
  } else {
    passwordError.value = "";
  }
};

const hasErrors = computed(() => {
  return emailError.value !== "" || passwordError.value !== "";
});


const handleSubmit = async () => {
  // Final validation check before submission
  validateEmail();
  validatePassword();
  if (hasErrors.value) return;

  try {
    if (isLogin.value) {
      // --- LOGIN FLOW ---
      const response = await authStore.login({
        email: form.email,
        password: form.password,
      });
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 3000 });

      const userRole = response?.role;

      // Small delay to let toast show before redirect
      setTimeout(() => {
        if (userRole === "admin") {
          navigateTo("/admin");
        } else {
          navigateTo("/");
        }
      }, 800);

    } else {
      // --- SIGNUP FLOW ---
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.studentInfo.department,
        matricNumber: form.studentInfo.matricNumber,
      };

      if (form.role === "alumni") {
        let formattedGradYear = form.alumniInfo.graduationYear;
        if (formattedGradYear && formattedGradYear.length === 4) {
          formattedGradYear = `${formattedGradYear}-10-01T00:00:00Z`;
        }

        payload.alumniInfo = {
          graduationYear: formattedGradYear,
          jobTitle: form.alumniInfo.jobTitle,
          currentCompany: form.alumniInfo.currentCompany,
          isStar: form.alumniInfo.isStar,
        };
      }

      await authStore.signup(payload);
      
      toast.add({ severity: 'success', summary: 'Account Created', detail: 'Registration successful! Please log in.', life: 4000 });

      isLogin.value = true;
      form.password = "";
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: authStore.authError || 'An error occurred.', life: 4000 });
  }
};
</script>

<style lang="scss" scoped>
#authPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  font-family: inherit;

  @mixin glass-panel {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
      color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
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
      img { width: 100%; height: 100%; object-fit: contain; }
    }

    h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--text-color), var(--text-gradient-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p { margin: 0; font-size: 0.95rem; }
  }

  .auth-card {
    @include glass-panel;
    padding: 30px;
  }

  .tab-switcher {
    display: flex;
    background: color-mix(in srgb, var(--secondary-color) 10%, transparent);
    border-radius: 12px;
    padding: 5px;
    margin-bottom: 30px;
    border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);

    button {
      flex: 1;
      background: transparent;
      border: none;
      padding: 10px 0;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #8a8a93;

      &.active {
        background: $accent-color;
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
      font-weight: 500;
      margin-left: 5px;
    }

    /* Input Icon Alignment */
    .p-input-icon-left,
    .password-wrapper,
    .search-full-wrapper {
      position: relative;
      display: block;
      width: 100%;

      /* Targets all icons inside these wrappers */
      i {
        position: absolute !important;
        left: 15px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        color: #8a8a93;
        z-index: 2;
        margin: 0 !important; /* Overrides any previous negative margins */
      }
    }

    /* Ensure the inputs have enough padding so text doesn't type over the icon */
    .glass-input, :deep(.p-inputtext) {
      padding-left: 45px !important;
    }
    
    /* PrimeVue Password Specific Override */
    :deep(.glass-password) {
      .p-password-input { 
        padding-left: 45px !important; 
      }
      /* Keeps the visibility toggle eye icon on the right */
      .p-password-mask { 
        position: absolute;
        color: #8a8a93; 
        right: 15px; 
        top: 50%;
        transform: translateY(-50%);
      }
    }

    /* PrimeVue specific overrides */
    :deep(.glass-password) {
      .p-password-input { padding-left: 45px !important; }
      .p-password-mask { color: #8a8a93; right: 15px; }
    }

    :deep(.dropdown-override) {
      padding: 0;
      display: flex;
      align-items: center;
      .p-dropdown-label { padding: 12px 15px; color: var(--text-color); }
      .p-dropdown-trigger { color: #8a8a93; width: 3rem; }
    }
    
    .p-error { color: #ff4757; font-size: 0.8rem; margin-left: 5px; }
  }

  .role-selector {
    display: flex;
    gap: 15px;
    margin-top: 5px;

    label { font-size: 0.9rem; }
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

  :deep(.submit-btn) {
    margin-top: 10px;
    width: 100%;
    background: $accent-color !important;
    border: none !important;
    color: #fff !important;
    padding: 15px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    transition: opacity 0.3s, transform 0.2s;
    justify-content: center;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  }

  .back-link {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 25px;
    color: #8a8a93;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover { color: var(--text-color); }
  }

  @media (max-width: 480px) {
    .auth-wrapper { max-width: 100%; }
    .form-row { flex-direction: column; gap: 20px; }
  }
}
</style>