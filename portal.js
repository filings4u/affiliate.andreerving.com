import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.58.0';
const db=createClient('https://gnfyidajbectlppsekzj.supabase.co','sb_publishable_DGt4HrHAwWyMt-0Xtzlfog_F18RnOyf');
const API='https://gnfyidajbectlppsekzj.supabase.co/functions/v1/andre-affiliates';
const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v)||0),date=v=>v?new Date(v).toLocaleDateString():'—';
let current=null,account=null,courseCatalog=[];
function toast(message){const box=$('toast');box.textContent=message;box.classList.add('visible');setTimeout(()=>box.classList.remove('visible'),3500)}
async function api(action,data={}){const {data:{session}}=await db.auth.getSession();if(!session?.access_token)throw Error('Please sign in again');const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({action,...data})});const x=await r.json().catch(()=>({}));if(!r.ok){if(x.error==='AFFILIATE_ACCESS_REVOKED'){await db.auth.signOut();current=null;account=null;$('portal').hidden=true;$('login-view').hidden=false;$('login-message').textContent='Your affiliate application was denied. Affiliate portal access has been revoked. Your Andre Erving account remains available for other services.';}throw Error(x.error||'Affiliate service unavailable')}return x}
function shell(page){const allowed=['dashboard','apply','links','sales','payouts','payment-setup','account'];const verified=account?.profile?.status==='active';const key=allowed.includes(page)&&(verified||!['links','sales','payouts','payment-setup'].includes(page))?page:'dashboard';document.querySelectorAll('[data-page]').forEach(a=>{a.classList.toggle('active',a.dataset.page===key);a.setAttribute('aria-current',a.dataset.page===key?'page':'false')});return key}
function summary(rows,status){return rows.filter(x=>x.status===status).reduce((sum,x)=>sum+Number(x.commission_amount||0),0)}
function heading(title,description){return '<div class="heading"><span class="eyebrow">ANDRE ERVING / AFFILIATE PARTNERS</span><h1>'+esc(title)+'</h1><p>'+esc(description)+'</p></div>'}
function linkBox(url,label){return '<section class="panel"><h2>'+esc(label)+'</h2><div class="ref-link"><input type="text" readonly value="'+esc(url)+'" aria-label="'+esc(label)+'"><button type="button" data-copy="'+esc(url)+'">Copy link</button></div><p class="ref-open"><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Open referral link ↗</a></p></section>'}
function render(){
 if(!account)return;
 const p=account.profile;const conversions=account.conversions||[],payouts=account.payouts||[],key=shell(location.hash.replace(/^#\/?/,''));
 const pending=summary(conversions,'pending'),approved=summary(conversions,'approved'),paid=summary(conversions,'paid');
 let content='';
 if(!p){
 const regionCodes='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
 const countryNames=new Intl.DisplayNames(['en'],{type:'region'});
 const markets=[...new Set(regionCodes.map(code=>countryNames.of(code)))].sort((a,b)=>a.localeCompare(b));
 markets.unshift('Global / International');
 const typeOptions=['Content creator','Educator or trainer','Business or organization','Consultant or coach','Blogger or publisher','Community owner','Other'];
 const channelOptions=['Social media','Email newsletter','Website or blog','YouTube or video','Podcast','Online community','Direct referrals','Other'];
 const audienceOptions=['Under 1,000','1,000–5,000','5,001–25,000','25,001–100,000','Over 100,000'];
 const selectOptions=items=>'<option value="">Select one</option>'+items.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');
 content=heading('Affiliate Partner Application','Tell us about your business, promotional channels, and the audience you serve.')+
 '<section class="panel"><form id="affiliate-application" class="affiliate-form">'+
 '<div class="apply-grid">'+
 '<label class="form-control"><span class="apply-label">Full name <span class="apply-required" aria-hidden="true">*</span></span><input class="input" name="fullName" required minlength="2" maxlength="150" value="'+esc(current?.user_metadata?.full_name||'')+'"></label>'+
 '<input type="hidden" name="email" value="'+esc(current?.email||'')+'">'+
 '<label class="form-control">Business or brand name<input class="input" name="businessName" maxlength="180"><small>Enter your name if applying individually.</small></label>'+
 '<label class="form-control"><span class="apply-label">Country or primary market <span class="apply-required" aria-hidden="true">*</span></span><select class="input" name="countryMarket" required>'+selectOptions(markets)+'</select></label>'+
 '</div><h2>Your Promotion Channels</h2>'+
 '<label class="form-control"><span class="apply-label">Website or primary promotional channel <span class="apply-required" aria-hidden="true">*</span></span><input class="input" name="primaryChannel" required maxlength="300" placeholder="Website URL, social profile, or channel name"></label>'+
 '<label class="form-control"><span class="apply-label">Partner type <span class="apply-required" aria-hidden="true">*</span></span><select class="input" name="partnerType" required>'+selectOptions(typeOptions)+'</select></label>'+
 '<fieldset class="apply-fieldset"><legend>How will you promote Andre Erving resources? <span class="apply-required" aria-hidden="true">*</span></legend><div class="apply-checks">'+
 channelOptions.map(x=>'<label><input type="checkbox" name="promotionChannels" value="'+esc(x)+'"> '+esc(x)+'</label>').join('')+
 '</div></fieldset>'+
 '<label class="form-control">Additional social media or profile links<textarea class="input" name="additionalProfiles" maxlength="2500" rows="4"></textarea></label>'+
 '<h2>Your Audience</h2>'+
 '<label class="form-control"><span class="apply-label">Briefly describe your audience <span class="apply-required" aria-hidden="true">*</span></span><small>Who do you serve, and what topics or resources are they interested in?</small><textarea class="input" name="audienceDescription" required minlength="10" maxlength="1800" rows="5"></textarea></label>'+
 '<label class="form-control"><span class="apply-label">Audience size or monthly traffic <span class="apply-required" aria-hidden="true">*</span></span><select class="input" name="audienceSize" required>'+selectOptions(audienceOptions)+'</select></label>'+
 '<h2>Agreement</h2><label class="apply-agreement"><input type="checkbox" name="agreedToTerms" required> I agree to the <a href="/affiliate-terms.html" target="_blank" rel="noopener">Affiliate Program Terms</a> and will clearly disclose my affiliate relationship when promoting eligible products or resources. <span class="apply-required" aria-hidden="true">*</span></label>'+
 '<button class="primary" type="submit">Submit application</button><p id="affiliate-apply-message" role="status" aria-live="polite"></p></form></section>';
}
 else if(p.status!=='active'){content=heading('Application under review','Your affiliate account is verified. Access is subject to management approval.')+'<section class="panel"><h2>Application status: <span class="chip">'+esc(p.status)+'</span></h2><p>'+ (p.status==='pending'?'Thank you for applying to the Andre Erving Affiliate Partner Program. Applications are manually reviewed based on audience fit, promotional methods, and compliance with program requirements. Submitting an application does not guarantee approval. If approved, you will receive additional instructions for accessing your affiliate links and tracking referrals.':'Your affiliate application requires management review. Contact support@andreerving.com for assistance.')+'</p><p class="muted">Referral links, sales, commissions and payout tools are not available until approval.</p><button type="button" id="affiliate-check-status" class="primary">Check approval status</button></section>'}
 else if(key==='dashboard'){content=heading('Affiliate overview','Your personalized referral and earnings dashboard')+'<div class="stats">'+[['Tracked visits',Number(account.clicks||0).toLocaleString()],['Pending',money(pending)],['Approved',money(approved)],['Paid',money(paid)]].map(([k,v])=>'<section class="stat"><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></section>').join('')+'</div>'+linkBox('https://andreerving.com/?ref='+p.code,'Your main referral link')+'<section class="panel"><h2>Partner overview</h2><p>Commission rate: <strong>'+esc(p.commissionRate)+'%</strong> · Tracking window: '+esc(account.settings?.attributionDays)+' days · Minimum payout: '+money(account.settings?.minPayout)+'</p><p class="muted">Paid sales are subject to commission approval, refunds and program terms. Always disclose affiliate relationships when promoting.</p></section>'}
 else if(key==='links'){
 const rows=[['Website','https://andreerving.com/'],['All courses','https://andreerving.com/courses.html'],...courseCatalog.map(c=>[c.title,c.url])];
 content=heading('Referral links','Share your personalized tracking links to the website and every published course.')+
 '<div class="link-grid">'+rows.map(([label,url])=>linkBox(url+(url.includes('?')?'&':'?')+'ref='+encodeURIComponent(p.code),label)).join('')+'</div>'+
 '<section class="panel"><h2>Promotion guidelines</h2><p>Clearly disclose your affiliate relationship. Do not spam or make misleading earnings claims.</p><a href="/affiliate-terms.html">Read affiliate terms</a></section>';
}
 else if(key==='sales'){content=heading('Referral sales','Verified purchases attributed to your referral links')+'<section class="panel"><h2>Sales history</h2><div class="tablewrap"><table><thead><tr><th>Date</th><th>Sale amount</th><th>Commission</th><th>Status</th></tr></thead><tbody>'+(conversions.map(x=>'<tr><td>'+date(x.created_at)+'</td><td>'+money(x.gross_amount)+'</td><td>'+money(x.commission_amount)+'</td><td><span class="chip">'+esc(x.status)+'</span></td></tr>').join('')||'<tr><td colspan="4">No referral sales have been recorded yet.</td></tr>')+'</tbody></table></div></section>'}
 else if(key==='payouts'){content=heading('Commissions & payouts','Your earning balance and payout history')+'<div class="stats">'+[['Pending review',money(pending)],['Approved',money(approved)],['Paid',money(paid)],['Minimum payout',money(account.settings?.minPayout)]].map(([k,v])=>'<section class="stat"><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></section>').join('')+'</div><section class="panel"><h2>Payout history</h2><div class="tablewrap"><table><thead><tr><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>'+(payouts.map(x=>'<tr><td>'+date(x.created_at)+'</td><td>'+money(x.amount)+'</td><td>'+esc(x.status)+'</td></tr>').join('')||'<tr><td colspan="3">No payouts have been issued.</td></tr>')+'</tbody></table></div><div class="alert">Stripe Connect payouts are not yet activated. Approved balances are not automatically transferred.</div></section>'}
 else if(key==='payment-setup'){
 const pay=account.payoutSetup||{};
 content=heading('Payment Setup','Configure how approved affiliate commissions may be paid.')+
 '<section class="panel"><h2>Choose your payout method</h2><p>Payment preferences do not initiate payouts. All commissions remain subject to approval, holding periods, eligibility, and verification.</p>'+
 '<div class="payout-methods"><section class="payout-method"><h3>Bank account · Stripe Connect</h3><p>For eligible U.S. partners. Enter banking information on Stripe’s secure hosted onboarding page, never into this website.</p>'+
 '<p><strong>Status:</strong> '+(pay.stripeConnected?'Stripe account created — finish or review onboarding':'Not connected')+'</p>'+
 '<button type="button" class="primary" id="connect-bank">'+(pay.stripeConnected?'Continue bank setup':'Set up bank payouts')+'</button><p id="bank-message" role="status" class="muted"></p></section>'+
 '<section class="payout-method"><h3>Zelle® payout preference</h3><p>Zelle transfers are manual, subject to availability and management review. Set the email or U.S. mobile number already enrolled with Zelle.</p>'+
 '<form id="zelle-setup" class="profile-form"><label>Enrolled contact type<select name="contactType" required><option value="">Choose one</option><option value="email" '+(pay.zelleContactType==='email'?'selected':'')+'>Zelle email</option><option value="phone" '+(pay.zelleContactType==='phone'?'selected':'')+'>U.S. mobile number</option></select></label>'+
 '<label>Zelle registered email or U.S. mobile<input name="contact" type="text" required maxlength="254" value="'+esc(pay.zelleContact||'')+'" autocomplete="off"></label>'+
 '<div class="zelle-terms"><h4>Zelle payout agreement</h4><ol><li>Zelle availability, business use, and transfer limits depend on the participating bank or credit union. Selecting Zelle does not guarantee an available payout method.</li><li>You confirm that the contact belongs to you and is enrolled in an eligible account authorized to receive these payments. You must notify support before changing your destination.</li><li>Transfers to enrolled recipients generally cannot be reversed or cancelled. Verify your details carefully before requesting payout.</li><li>Only reviewed, eligible and approved commissions may be paid. Minimum thresholds, holds, refunds, taxes, and compliance checks still apply; no payout is guaranteed by setup.</li><li>Zelle payments are manually initiated after management approval. We do not request your bank passwords, routing or account numbers for Zelle.</li></ol></div>'+
 '<label class="consent-label"><input type="checkbox" name="accepted" required> I have read and agree to the Zelle payout terms above.</label>'+
 '<button class="primary" type="submit">Save Zelle payout preference</button><p id="zelle-message" role="status" class="muted"></p></form></section></div>'+
 '<p class="muted">Your saved preference: <strong>'+esc(pay.method==='zelle'?'Zelle':pay.method==='bank'?'Bank':'Not configured')+'</strong>. A preference does not constitute a payment instruction.</p></section>';
}
 else if(key==='account'){
 content=heading('My affiliate profile','Manage your public partner details and account information.')+
 '<section class="panel"><div class="profile-summary"><div class="profile-avatar" aria-hidden="true">'+esc((p.displayName||p.name||'A').trim().charAt(0).toUpperCase())+'</div><div><h2>'+esc(p.displayName||p.name)+'</h2><p>Affiliate '+esc(p.status)+' · '+esc(p.commissionRate)+'% commission rate</p></div></div>'+
 '<form id="profile-form" class="profile-form"><div class="profile-grid"><label>Display name<input name="displayName" required minlength="2" maxlength="150" value="'+esc(p.displayName||p.name||'')+'"></label>'+
 '<label>Business or brand name<input name="businessName" maxlength="180" value="'+esc(p.businessName||'')+'"></label>'+
 '<label>Contact phone<input name="phone" type="tel" maxlength="30" value="'+esc(p.phone||'')+'"></label>'+
 '<label>Country or primary market<input name="market" maxlength="120" value="'+esc(p.market||'')+'"></label>'+
 '<label>Website or primary promotional channel<input name="website" maxlength="300" value="'+esc(p.website||'')+'"></label></div>'+
 '<label>Partner biography<textarea name="bio" rows="5" maxlength="1200" placeholder="Tell us about your brand, business or audience.">'+esc(p.bio||'')+'</textarea></label>'+
 '<button type="submit" class="primary">Save profile</button><p id="profile-message" role="status" class="muted"></p></form></section>'+
 '<section class="panel"><h2>Account security</h2><p>Your sign-in email is locked and not displayed on this portal. To request an email address change, submit a support request. Support will verify account ownership before making any changes.</p>'+
 '<form id="email-change-support" class="profile-form"><label>Reason for email change<textarea name="reason" required minlength="10" maxlength="1200" rows="4" placeholder="Describe why you need to update the login email. Please do not include passwords or account numbers."></textarea></label>'+
 '<button type="submit" class="primary">Submit support request</button><p id="support-message" role="status" class="muted"></p></form><p><a href="/affiliate-terms.html">Affiliate program terms</a></p></section>';
}
 $('content').innerHTML=content;
 const activated=!!p&&p.status==='active';
 document.querySelectorAll('[data-page]').forEach(a=>{const restricted=['links','sales','payouts','payment-setup'].includes(a.dataset.page);a.hidden=(restricted&&!activated)||(a.dataset.page==='apply'&&!!p);a.setAttribute('aria-disabled',restricted&&!activated?'true':'false')});
 const applyForm=$('affiliate-application');
 if(applyForm)applyForm.addEventListener('submit',async event=>{
 event.preventDefault();if(!applyForm.reportValidity())return;
 const fields=Object.fromEntries(new FormData(applyForm));
 fields.promotionChannels=[...applyForm.querySelectorAll('input[name="promotionChannels"]:checked')].map(x=>x.value);
 fields.agreedToTerms=applyForm.elements.agreedToTerms.checked;
 if(!fields.promotionChannels.length){$('affiliate-apply-message').textContent='Select at least one promotion channel.';return}
 const button=applyForm.querySelector('button[type="submit"]');button.disabled=true;
 try{await api('apply',fields);await load();toast('Your affiliate application was received.')}
 catch(error){$('affiliate-apply-message').textContent=error.message||'Unable to submit application'}
 finally{button.disabled=false}
});
 $('affiliate-check-status')?.addEventListener('click',async()=>{try{await load();toast('Application status refreshed')}catch(e){toast(e.message||'Unable to check status')}});

 const profileForm=$('profile-form');
 if(profileForm)profileForm.onsubmit=async e=>{e.preventDefault();const btn=profileForm.querySelector('[type="submit"]');btn.disabled=true;try{
   const x=await api('affiliate_profile_update',Object.fromEntries(new FormData(profileForm)));
   if(!x.updated)throw Error('Profile update was not saved');
   $('profile-message').textContent='Profile saved successfully.';await load();toast('Profile updated');
  }catch(err){$('profile-message').textContent=err.message||'Profile save failed'}finally{btn.disabled=false}};
 const supportForm=$('email-change-support');
 if(supportForm)supportForm.onsubmit=async e=>{e.preventDefault();const btn=supportForm.querySelector('[type="submit"]');btn.disabled=true;try{
   const x=await api('affiliate_email_support',Object.fromEntries(new FormData(supportForm)));
   $('support-message').textContent=x.notice||'Support request created';supportForm.reset();
  }catch(err){$('support-message').textContent=err.message||'Support request failed'}finally{btn.disabled=false}};
 const zelle=$('zelle-setup');
 if(zelle)zelle.onsubmit=async e=>{e.preventDefault();const btn=zelle.querySelector('[type="submit"]');btn.disabled=true;try{
   const x=await api('affiliate_payment_setup',{method:'zelle',contact:zelle.elements.contact.value,contactType:zelle.elements.contactType.value,accepted:zelle.elements.accepted.checked});
   $('zelle-message').textContent=x.message||'Preference saved';await load();toast('Payout preference saved');
  }catch(err){$('zelle-message').textContent=err.message||'Unable to save payout preference'}finally{btn.disabled=false}};
 $('connect-bank')?.addEventListener('click',async()=>{const btn=$('connect-bank');btn.disabled=true;try{
   const x=await api('affiliate_payment_setup',{method:'bank'});
   if(x.url){window.location.assign(x.url);return}
   $('bank-message').textContent=x.message||'Bank setup is unavailable';
  }catch(err){$('bank-message').textContent=err.message||'Unable to start bank setup'}finally{btn.disabled=false}});


 document.querySelectorAll('[data-copy]').forEach(btn=>btn.onclick=async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);toast('Referral link copied')}catch{btn.previousElementSibling?.select();toast('Select and copy the referral link')}});
}
async function load(){const data=await api('dashboard');if(data.verificationRequired){account=null;verificationGate();return}account=data;
if(data.profile?.status==='active'){try{const c=await api('affiliate_catalog');courseCatalog=c.courses||[]}catch(err){console.warn('Course catalog unavailable',err.message);courseCatalog=[]}}
$('partner-name').textContent=data.profile?.displayName||data.profile?.name||'Affiliate Partner';render()}
function verificationGate(){
 $('portal').hidden=false;$('login-view').hidden=true;
 document.querySelectorAll('[data-page]').forEach(link=>link.hidden=true);
 $('content').innerHTML=heading('One more verification step','Protecting affiliate accounts with two independent email checks')+
 '<section class="panel"><h2>Verify your affiliate email a second time</h2><p>We already verified your account invitation. Now enter the separate six-digit code sent to your verified email address before accessing the portal.</p>'+
 '<p><button id="send-code" type="button" class="primary">Email me a verification code</button></p><form id="double-verification"><label class="form-control">Six-digit code<input id="second-code" class="input" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" required></label>'+
 '<button class="primary" type="submit">Confirm verification</button></form><p id="verification-message" role="status" aria-live="polite"></p></section>';
 $('send-code').onclick=async()=>{const button=$('send-code');button.disabled=true;try{const x=await api('send_second_code');$('verification-message').textContent=x.waitSeconds?'Please check your inbox. You can resend in '+x.waitSeconds+' seconds.':'A six-digit code was sent to your email.';if(x.verified)await boot()}catch(e){$('verification-message').textContent=e.message||'Unable to send code'}finally{button.disabled=false}};
 $('double-verification').onsubmit=async event=>{event.preventDefault();const button=event.target.querySelector('[type="submit"]');button.disabled=true;try{const x=await api('verify_second_code',{code:$('second-code').value});if(!x.verified)throw Error('Verification failed');toast('Email verification completed.');await boot()}catch(e){$('verification-message').textContent=e.message||'Incorrect verification code'}finally{button.disabled=false}};
}
async function boot(){const {data:{user},error}=await db.auth.getUser();$('auth-loading').hidden=true;if(error||!user){$('login-view').hidden=false;$('portal').hidden=true;return}current=user;try{
 const v=await api('verification_status');
 if(!v.primaryVerified)throw Error('Verify your account activation email before signing in.');
 if(!v.verified){verificationGate();return}
 await load();$('login-view').hidden=true;$('portal').hidden=false;
}catch(err){if(String(err.message).includes('AFFILIATE_ACCESS_REVOKED')){await db.auth.signOut();current=null;account=null;$('portal').hidden=true;$('login-view').hidden=false;$('login-message').textContent='Your affiliate application was denied. Affiliate portal access has been revoked. Your Andre Erving account remains available for other services.';return} $('login-view').hidden=true;$('portal').hidden=false;$('content').innerHTML='<section class="panel"><h2>Affiliate account needs attention</h2><p>'+esc(err.message)+'</p><button class="primary" id="retry">Retry</button></section>';$('retry').onclick=boot}}
$('login-form').onsubmit=async event=>{event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;$('login-message').textContent='Signing in…';const {error}=await db.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});button.disabled=false;if(error){$('login-message').textContent=error.message;return}$('login-message').textContent='';await boot()};
$('signout').onclick=async()=>{await db.auth.signOut();location.hash='';current=null;account=null;await boot()};
$('reset-password').href='reset.html';
$('mobile-toggle').onclick=()=>{const opened=$('portal').classList.toggle('nav-open');$('mobile-toggle').setAttribute('aria-expanded',String(opened));$('mobile-overlay').hidden=!opened};
$('mobile-overlay').onclick=()=>{$('portal').classList.remove('nav-open');$('mobile-overlay').hidden=true};
window.addEventListener('hashchange',()=>{if(current){if(account)render();else if(document.getElementById('double-verification')){document.querySelectorAll('[data-page]').forEach(link=>link.hidden=true)}$('portal').classList.remove('nav-open');$('mobile-overlay').hidden=true}});
window.addEventListener('focus',()=>{if(current)boot()});
boot();
