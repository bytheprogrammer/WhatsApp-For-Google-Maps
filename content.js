
// Global variables
let storeArray = [];
let seenStores = new Set();

// Helper function to remove "GET" from store name
function removeGETFromStoreName(storeName) {
    return storeName.replace(/GET$/, '').trim();
}

// Helper function to encode CSV data
function encodeCSV(str) {
    return '\uFEFF' + encodeURIComponent(str);
}

const storeInfo = () => {
    // Select all store containers
    const storeContainers = document.querySelectorAll('div.UaQhfb.fontBodyMedium');

    // Match store name and phone number
    storeContainers.forEach(container => {
        let storeName = container.querySelector('.qBF1Pd.fontHeadlineSmall')?.textContent.trim();
        const phoneNumber = container.querySelector('span.UsdlK')?.textContent.trim();
        
        storeName = removeGETFromStoreName(storeName);

        if (storeName && phoneNumber) {
            const storeKey = `${storeName} | ${phoneNumber}`;
        
            if (!seenStores.has(storeKey)) {
                storeArray.push({
                    storeName: storeName,
                    phoneNumber: phoneNumber
                });
                seenStores.add(storeKey);
            }
        }
    });

    console.log(storeArray);
}

const downloadCSV = () => {
    let csvContent = "Mağaza Adı,Telefon Numarası\n"; 

    storeArray.forEach(store => {
        csvContent += `${store.storeName},${store.phoneNumber}\n`;
    });

    const encodedUri = encodeCSV(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
    link.setAttribute("download", "magaza_bilgileri.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const addCSVButton = () => {
    const body = document.querySelector('body.LoJzbe');
    
    if (body && !document.getElementById('csvButton')) {
        const csvButton = document.createElement('button');
        csvButton.id = 'csvButton';
        csvButton.textContent = 'CSV İndir';
        csvButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;

        csvButton.addEventListener('click', () => {
            console.log('CSV İndir butonu tıklandı!');
            storeInfo();
            downloadCSV();
        });

        body.appendChild(csvButton);
    }
};

const addWhatsAppIcons = () => {
    const phoneDivs = document.querySelectorAll('div.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
    const iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png';
    const phonePattern1 = /^0\d{3} \d{3} \d{2} \d{2}$/;
    const phonePattern2 = /^\(0\d{3}\) \d{3} \d{2} \d{2}$/;

    phoneDivs.forEach(div => {
        const text = div.textContent.trim();
        let phoneNumber = text.replace(/[^0-9]/g, '');
        
        if ((phonePattern1.test(text) || phonePattern2.test(text)) && !div.querySelector('img.icon')) {
            if (phoneNumber.length === 10) {
                phoneNumber = '+90' + phoneNumber;
            } else if (phoneNumber.length === 11 && phoneNumber.startsWith('0')) {
                phoneNumber = '+90' + phoneNumber.slice(1);
            }

            if (!phoneNumber.startsWith('+')) {
                console.error('Geçersiz numara formatı:', phoneNumber);
                return;
            }

            const icon = document.createElement('img');
            icon.src = iconUrl;
            icon.alt = 'WhatsApp Icon';
            icon.className = 'icon';
            icon.style.width = '25px';
            icon.style.height = '25px';
            icon.style.marginLeft = '5px';
            icon.style.verticalAlign = 'middle';
            icon.style.pointerEvents = 'auto';

            div.appendChild(icon);

            console.log(`İkon eklendi: ${text}`);

            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(`https://wa.me/${phoneNumber}`, '_blank');
            });
        }
    });
};
    
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            setTimeout(() => {
                addWhatsAppIcons();
                addCSVButton();
                storeInfo();
            }, 2000);
            break;
        }
    }
});

observer.observe(document.querySelector('div[role="main"]') || document.body, { childList: true, subtree: true });

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            addWhatsAppIcons();
            addCSVButton();
            storeInfo();
        }, 2000);
    });
} else {
    addWhatsAppIcons();
    addCSVButton();
    storeInfo();
}