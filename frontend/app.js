// When served by the Express server, calls go to the same origin.
// If you open index.html directly from disk, it falls back to localhost.
// To use a deployed backend, set API_BASE to its URL, e.g. 'https://my-app.onrender.com'
const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = `${API_BASE}/api/products`;

const $ = (id) => document.getElementById(id);
const fields = ['product_name', 'brand', 'category', 'price', 'stock', 'description'];

function show(text, ok = true) {
  const el = $('msg');
  el.textContent = text;
  el.className = ok ? 'ok' : 'err';
  setTimeout(() => (el.className = ''), 3500);
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors ? data.errors.join(', ') : data.error || 'Request failed');
  return data;
}

async function loadProducts() {
  try {
    const rows = await request(API);
    $('count').textContent = rows.length;
    $('tbody').innerHTML = rows.map((p) => `
      <tr>
        <td>${p.id}</td>
        <td>${esc(p.product_name)}</td>
        <td>${esc(p.brand)}</td>
        <td>${esc(p.category)}</td>
        <td>$${Number(p.price).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td class="desc">${esc(p.description)}</td>
        <td>${esc(p.updated_at)}</td>
        <td>
          <button class="edit" onclick="editProduct(${p.id})">Edit</button>
          <button class="del" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="9">No products yet.</td></tr>';
  } catch (e) {
    show('Could not load products: ' + e.message, false);
  }
}

function resetForm() {
  $('productForm').reset();
  $('id').value = '';
  $('formTitle').textContent = 'Add a new product';
  $('saveBtn').textContent = 'Save product';
  $('cancelBtn').style.display = 'none';
}

async function editProduct(id) {
  try {
    const p = await request(`${API}/${id}`);          // GET one record
    $('id').value = p.id;
    fields.forEach((f) => ($(f).value = p[f] ?? ''));
    $('formTitle').textContent = `Edit product #${p.id}`;
    $('saveBtn').textContent = 'Update product';
    $('cancelBtn').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) { show(e.message, false); }
}

async function deleteProduct(id) {
  if (!confirm(`Delete product #${id}?`)) return;
  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    show('Product deleted');
    loadProducts();
  } catch (e) { show(e.message, false); }
}

$('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  fields.forEach((f) => (body[f] = $(f).value));
  const id = $('id').value;
  try {
    if (id) {
      await request(`${API}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      show('Product updated');
    } else {
      await request(API, { method: 'POST', body: JSON.stringify(body) });
      show('Product created');
    }
    resetForm();
    loadProducts();
  } catch (err) { show(err.message, false); }
});

$('cancelBtn').addEventListener('click', resetForm);
loadProducts();
