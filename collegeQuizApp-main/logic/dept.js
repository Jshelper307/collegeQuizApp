function toggleButton(value) {
    const button = document.getElementById('additem');
    const text = document.getElementById('inputnewitem');
    button.style.display = value ? 'block' : 'none';
    text.style.display = value ? 'block' : 'none';
  }
  toggleButton(true);