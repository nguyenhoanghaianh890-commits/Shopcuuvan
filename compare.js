/**
 * Account Compare Tool Logic
 * Manages selected accounts in LocalStorage and updates the UI comparison bar.
 */

const COMPARE_STORAGE_KEY = 'nickv6_compare_list';
const MAX_COMPARE = 4;

function getCompareList() {
    try {
        const data = localStorage.getItem(COMPARE_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error parsing compare list', e);
        return [];
    }
}

function formatCash(number) {
    return Math.round(Number(number)).toLocaleString('vi-VN');
}

function saveCompareList(list) {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list));
    updateCompareUI();
    // Broadcast change for other components (like /so-sanh page)
    window.dispatchEvent(new CustomEvent('compare-list-updated', {
        detail: list
    }));
}

function toggleCompare(id, type, name, image, categoryType) {
    if (categoryType === 'random') {
        Notiflix.Notify.warning('Không thể so sánh tài khoản random.');
        return;
    }

    let list = getCompareList();
    const index = list.findIndex(item => item.id === id && item.type === type);

    if (index > -1) {
        // Remove
        list.splice(index, 1);
        Notiflix.Notify.success('Đã xóa khỏi danh sách so sánh');
    } else {
        // Add
        if (list.length >= MAX_COMPARE) {
            Notiflix.Notify.warning(`Bạn chỉ có thể so sánh tối đa ${MAX_COMPARE} tài khoản`);
            return;
        }
        list.push({
            id,
            type,
            name,
            image
        });
        Notiflix.Notify.success('Đã thêm vào danh sách so sánh');
    }

    saveCompareList(list);
}

function removeFromCompare(id, type) {
    let list = getCompareList();
    list = list.filter(item => !(item.id === id && item.type === type));
    saveCompareList(list);
}

function clearCompare() {
    saveCompareList([]);
}

function updateCompareUI() {
    const list = getCompareList();
    const bar = document.getElementById('compare-bar');
    const countBadge = document.getElementById('compare-count');
    const container = document.getElementById('compare-items-container');

    if (!bar || !container) return;

    if (list.length > 0) {
        bar.classList.add('show');
        if (countBadge) countBadge.textContent = list.length;

        container.innerHTML = list.map(item => `
            <div class="compare-item-thumb" title="${item.name}">
                <img src="${item.image}" alt="${item.name}" />
                <span class="remove-item" onclick="removeFromCompare(${item.id}, '${item.type}')">&times;</span>
            </div>
        `).join('');
    } else {
        bar.classList.remove('show');
    }

    // Update button states in the list
    document.querySelectorAll('.btn-compare').forEach(btn => {
        // We need a way to identify which account this button belongs to
        // If the button has an onclick with the ID, we can check it
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            list.forEach(item => {
                if (onclickAttr.includes(`toggleCompare(${item.id}, '${item.type}'`)) {
                    btn.classList.add('active');
                } else if (!list.some(i => onclickAttr.includes(`toggleCompare(${i.id}, '${i.type}'`))) {
                    // This is tricky without unique IDs on buttons, 
                    // maybe we should re-render or just let the bar be the source of truth
                }
            });

            // Reset state if not in list
            const isInList = list.some(item => onclickAttr.includes(`toggleCompare(${item.id}, '${item.type}'`));
            if (isInList) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-secondary');
                btn.innerHTML = '<i class="fa fa-check"></i> Đang chọn';
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-secondary');
                btn.innerHTML = '<i class="fa fa-exchange"></i> So sánh';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCompareUI();
});