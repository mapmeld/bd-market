(function() {
  // বাঙালি translations

  const translations = {
    "BD-Market": "বাংলা বাজার",
    "Buy": "এই কিনুন",
    "Buy Now": "এখন কেন",
    "Customer": "ক্রেতা",
    "Create User": "ব্যবহারকারী তৈরি করুন",
    "Currently selling:": "বর্তমানে বিক্রয়:",
    "E-mail": "ই-মেইল",
    "Farmer": "কৃষক",
    "from": "থেকে", // follows name
    "If you haven't created an account,": "আপনি যদি একটি অ্যাকাউন্ট তৈরি না করেন,",
    "Log In": "লগ ইন",
    "Log Out": "প্রস্থান",
    "Manager": "ব্যবস্থাপক",
    "Name": "নাম",
    "Password": "পাসওয়ার্ড",
    "Preferred Language (type one)": "পছন্দের ভাষা (টাইপ এক)",
    "Previously sold:": "পূর্বে বিক্রি:",
    "Quantity": "পরিমাণ",
    "Register Now": "এখন নিবন্ধন করুন",
    "remaining": "বাকি",
    "Role": "সাইটে ভূমিকা",
    "Sold Out": "বিক্রি শেষ",
    "test market for farmers' products": "কৃষকদের পণ্যের জন্য পরীক্ষা বাজার",
    "Total": "মোট",
    "Username": "ব্যবহারকারীর নাম",
    "View Cart": "কার্ট দেখুন"
  };

  var labels = document.getElementsByClassName("translate");
  if (window.location.href.indexOf('bd=yes') > -1) {
    document.body.parentElement.lang = 'bd';
    for (var nn = 0; nn < labels.length; nn++) {
      var phrase = labels[nn].innerHTML;
      if (phrase && translations[phrase]) {
        labels[nn].innerHTML = translations[phrase];
      }
    
      phrase = labels[nn].value;
      if (phrase && translations[phrase]) {
        labels[nn].value = translations[phrase];
      }
    
      phrase = labels[nn].placeholder;
      if (phrase && translations[phrase]) {
        labels[nn].placeholder = translations[phrase];
      }
    }
  }
})();