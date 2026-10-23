let selectedBundle = null;

async function loadBundles(){
 const { data, error } = await supabaseClient.from('bundles').select('*').eq('is_active', true).order('price')
 if(error){ document.getElementById('bundles').innerHTML = error.message; return }
 
 document.getElementById('bundles').innerHTML = data.map(b => `
  <div class="card">
   <span class="net">${b.network}</span>
   <h3>${b.size_gb}GB</h3>
   <p>${b.validity}</p>
   <div class="price">GHS ${b.price}</div>
   <button class="buy" onclick="openOrder('${b.id}', '${b.network}', '${b.size_gb}', '${b.price}')">Buy Now</button>
  </div>
 `).join('')
}

function openOrder(id, net, size, price){
 selectedBundle = { id, net, size, price }
 document.getElementById('orderTitle').innerText = `Buy ${size}GB ${net}`
 document.getElementById('orderPrice').innerText = `Price: GHS ${price}`
 document.getElementById('orderModal').style.display = 'block'
 window.scrollTo(0, document.body.scrollHeight)
}

function closeModal(){
 document.getElementById('orderModal').style.display = 'none'
}

async function submitOrder(){
 const phone = document.getElementById('custPhone').value
 const ref = document.getElementById('momoRef').value
 if(!phone || !ref){ alert('Enter phone and MoMo ID'); return }

 const { error } = await supabaseClient.from('orders').insert({
   bundle_id: selectedBundle.id,
   customer_phone: phone,
   customer_network: selectedBundle.net,
   amount_paid: selectedBundle.price,
   momo_reference: ref,
   status: 'pending'
 })
 if(error){ alert(error.message) } else {
   alert('Order received! We will deliver to '+phone+' in 5 mins after confirming payment.')
   closeModal()
 }
}

loadBundles()