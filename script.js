let totalWaste = 0; // Toplam atık miktarını takip etmek için sayaç

// Sağ menüdeki form tuşlarına tıklandığında form açılacak
document.getElementById('okulKayitBtn').addEventListener('click', () => toggleForm('okulKayitFormContainer'));
document.getElementById('ogrenciKayitBtn').addEventListener('click', () => toggleForm('ogrenciKayitFormContainer'));
document.getElementById('dataEntryBtn').addEventListener('click', () => toggleForm('dataEntryFormContainer'));
document.getElementById('viewDataBtn').addEventListener('click', () => toggleForm('viewDataFormContainer'));
document.getElementById('toplamAtikBtn').addEventListener('click', () => toggleForm('toplamAtikContainer'));

// Form açma fonksiyonu
function toggleForm(formId) {
    const formContainers = document.querySelectorAll('.form-container');
    formContainers.forEach(form => form.style.display = 'none'); // Diğer formları gizle
    document.getElementById(formId).style.display = 'block'; // Seçilen formu aç
}

// Okul Kaydı işlemi
document.getElementById('okulKayitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const schoolProvince = document.getElementById('schoolProvince').value;
    const schoolDistrict = document.getElementById('schoolDistrict').value;
    const schoolName = document.getElementById('schoolName').value;
    const schoolPassword = document.getElementById('schoolPassword').value;
    localStorage.setItem('school', JSON.stringify({ schoolProvince, schoolDistrict, schoolName, schoolPassword}));
    alert('Okul Kaydı Yapıldı');
});

// Öğrenci Kaydı işlemi
document.getElementById('ogrenciKayitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const studentSurname = document.getElementById('studentSurname').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const studentNumber = document.getElementById('studentNumber').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const studentClass = document.getElementById('studentClass').value;

    localStorage.setItem(studentEmail, JSON.stringify({
        studentName, studentSurname, studentEmail, studentNumber, studentPhone, studentClass, points: 0
    }));

    alert('Öğrenci Kaydı Yapıldı');
});

// Veri Girişi işlemi
document.getElementById('dataEntryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const wasteWeight = parseFloat(document.getElementById('wasteWeight').value);
    const wasteType = document.getElementById('wasteType').value;
    const studentEmail = prompt("Öğrencinin E-posta Adresini Girin");

    if (!studentEmail) {
        alert("E-posta gerekli.");
        return;
    }

    const studentData = JSON.parse(localStorage.getItem(studentEmail));
    if (!studentData) {
        alert("Öğrenci bulunamadı.");
        return;
    }

    const credit = calculateCredit(wasteWeight, wasteType);
    studentData.points += credit;
    totalWaste += wasteWeight; // Toplam atık miktarını güncelle
    localStorage.setItem(studentEmail, JSON.stringify(studentData));

    alert(`${wasteType} için ${credit} kredi eklendi.`);
    document.getElementById('totalWasteAmount').innerText = totalWaste.toFixed(2); // Toplam atık miktarını ekrana yazdır
});

// Kredi Hesaplama Fonksiyonu
function calculateCredit(weight, type) {
    let creditPerKg;

    switch(type) {
        case "Yağ":
            creditPerKg = 5;
            break;
        case "Tekstil":
            creditPerKg = 3;
            break;
        case "Pil":
            creditPerKg = 10;
            break;
        case "Elektronik":
            creditPerKg = 20;
            break;
        case "Kağıt":
            creditPerKg = 2;
            break;
        case "Cam":
            creditPerKg = 4;
            break;
        case "Metal":
            creditPerKg = 6;
            break;
        case "Plastik":
            creditPerKg = 3;
            break;
        default:
            creditPerKg = 0;
    }

    return creditPerKg * weight;
}

// Veri Görüntüleme işlemi
document.getElementById('viewDataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const viewEmail = document.getElementById('viewStudentEmail').value;
    const viewNumber = document.getElementById('viewStudentNumber').value;

    const studentData = JSON.parse(localStorage.getItem(viewEmail));

    // Öğrenci verisi kontrolü
    if (!studentData || studentData.studentNumber !== viewNumber) {
        alert("Geçersiz e-posta veya öğrenci numarası.");
        return;
    }

    const resultHTML = `
        <p><strong>Adı:</strong> ${studentData.studentName} ${studentData.studentSurname}</p>
        <p><strong>Öğrenci Numarası:</strong> ${studentData.studentNumber}</p>
        <p><strong>Sınıf:</strong> ${studentData.studentClass}</p>
        <p><strong>Toplam Kredi:</strong> ${studentData.points}</p>
    `;
    document.getElementById('viewResult').innerHTML = resultHTML;
});
