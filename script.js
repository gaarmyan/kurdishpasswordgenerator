// DOM Elements
const passwordField = document.getElementById('password');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeSimilarCheckbox = document.getElementById('exclude-similar');
const excludeSequentialCheckbox = document.getElementById('exclude-sequential');
const excludeRepeatedCheckbox = document.getElementById('exclude-repeated');
const startWithLetterCheckbox = document.getElementById('start-with-letter');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const toggleVisibilityBtn = document.getElementById('toggle-visibility');
const strengthBar = document.getElementById('strength-indicator');
const strengthText = document.getElementById('strength-text');
const strengthDetails = document.getElementById('strength-details');
const passwordHistory = document.getElementById('password-history');
const exportBtn = document.getElementById('export-btn');
const themeToggle = document.getElementById('theme-toggle');
const layoutToggle = document.getElementById('layout-toggle');
const body = document.body;
const html = document.documentElement;

// Character Sets
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+{}:"<>?[];,./`~';
const similarCharacters = 'il1Lo0O';

// Password History
let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];

// Password Visibility
let isPasswordVisible = false;

// Update Password Length Display
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
});

// Generate Password
function generatePassword() {
  const length = lengthInput.value;
  const includeUppercase = uppercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;
  const excludeSimilar = excludeSimilarCheckbox.checked;
  const excludeSequential = excludeSequentialCheckbox.checked;
  const excludeRepeated = excludeRepeatedCheckbox.checked;
  const startWithLetter = startWithLetterCheckbox.checked;

  let characters = lowercaseLetters;
  if (includeUppercase) characters += uppercaseLetters;
  if (includeNumbers) characters += numbers;
  if (includeSymbols) characters += symbols;
  if (excludeSimilar) {
    characters = characters
      .split('')
      .filter((char) => !similarCharacters.includes(char))
      .join('');
  }

  let password = '';
  let isValidPassword = false;

  while (!isValidPassword) {
    password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    // Check if password meets all criteria
    isValidPassword = true;

    // Exclude sequential characters
    if (excludeSequential && hasSequentialChars(password)) {
      isValidPassword = false;
      continue;
    }

    // Exclude repeated characters
    if (excludeRepeated && hasRepeatedChars(password)) {
      isValidPassword = false;
      continue;
    }

    // Start with a letter
    if (startWithLetter && !/[a-zA-Z]/.test(password[0])) {
      isValidPassword = false;
      continue;
    }
  }

  passwordField.value = password;
  updatePasswordStrength(password);
}

// Check for Sequential Characters
function hasSequentialChars(password) {
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password.charCodeAt(i);
    const char2 = password.charCodeAt(i + 1);
    const char3 = password.charCodeAt(i + 2);

    if (char2 === char1 + 1 && char3 === char2 + 1) {
      return true;
    }
  }
  return false;
}

// Check for Repeated Characters
function hasRepeatedChars(password) {
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      return true;
    }
  }
  return false;
}

// Update Password Strength
function updatePasswordStrength(password) {
  const strength = calculatePasswordStrength(password);
  strengthBar.style.width = `${strength}%`;
  strengthBar.style.backgroundColor =
    strength < 40 ? 'red' : strength < 70 ? 'orange' : 'green';
  strengthText.textContent =
    strength < 40 ? 'لاواز' : strength < 70 ? 'مام ناوەند' : 'بەهێز';
  strengthDetails.innerHTML = getPasswordStrengthDetails(password);
}

// Calculate Password Strength
function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 12) strength += 30;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 30;
  return Math.min(strength, 100);
}

// Get Password Strength Details
function getPasswordStrengthDetails(password) {
  let details = [];
  if (password.length < 12) details.push('وشەی نهێنی دەبێت بەلایەنی کەمەوە ١٢ پیت بێت.');
  if (!/[A-Z]/.test(password)) details.push('پیتی گەورە زیاد بکە بۆ ئاسایشی باشتر.');
  if (!/[0-9]/.test(password)) details.push('ژمارەکان بخەرە ناویەوە بۆ زیادکردنی ئاڵۆزییەکان.');
  if (!/[^A-Za-z0-9]/.test(password)) details.push('بۆ زۆرترین ئاسایش هێماکان بەکاربهێنە.');
  return details.map((detail) => `<div>${detail}</div>`).join('');
}

// Toggle Password Visibility
toggleVisibilityBtn.addEventListener('click', () => {
  isPasswordVisible = !isPasswordVisible;
  passwordField.type = isPasswordVisible ? 'text' : 'password';
  toggleVisibilityBtn.textContent = isPasswordVisible ? '🙈' : '👁️';
});

// Copy Password to Clipboard
copyBtn.addEventListener('click', () => {
  passwordField.select();
  document.execCommand('copy');
  alert('Password copied to clipboard!');
});

// Save Password to History
generateBtn.addEventListener('click', () => {
  generatePassword();
  if (passwordField.value) {
    const timestamp = new Date().toLocaleString();
    savedPasswords.push({ password: passwordField.value, timestamp });
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    displaySavedPasswords();
  }
});

// Display Saved Passwords
function displaySavedPasswords() {
  passwordHistory.innerHTML = savedPasswords
    .map(
      (entry, index) => `
      <li>
        <span>${entry.password} <small>(${entry.timestamp})</small></span>
        <button onclick="deletePassword(${index})">سڕینەوە</button>
      </li>
    `
    )
    .join('');
}

// Delete a Saved Password
function deletePassword(index) {
  savedPasswords.splice(index, 1);
  localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
  displaySavedPasswords();
}

// Export Passwords as a .txt File
exportBtn.addEventListener('click', () => {
  const content = savedPasswords
    .map((entry) => `${entry.password} (${entry.timestamp})`)
    .join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'passwords.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Theme Toggle
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.toggle('dark-mode', savedTheme === 'dark');
themeToggle.checked = savedTheme === 'dark';

themeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Initial Display of Saved Passwords
displaySavedPasswords();