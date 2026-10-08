/* EDF Zen Flex Card 0.2.0-beta9 — no external dependencies */
const DAY_ICONS={eco:'mdi:cash',sobriete:'mdi:cash-multiple',bonus:'mdi:piggy-bank'};
const RATE_ICONS={eco_hc:'mdi:weather-night',eco_hp:'mdi:weather-sunny',sobriete_hc:'mdi:moon-waning-crescent',sobriete_hp:'mdi:white-balance-sunny'};
const ICON=(name)=>{const el=document.createElement('ha-icon');el.setAttribute('icon',name);el.style.cssText='--mdc-icon-size:26px;vertical-align:middle;margin-right:8px;flex-shrink:0';return el;};
const LABELS={eco:'Éco',sobriete:'Sobriété',bonus:'Bonus'};
class ZenFlexCard extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._month=null;this._signature=null;}
  setConfig(config){if(!['compact','full'].includes(config.mode||'full'))throw Error('mode : compact ou full');this.config={show_tariffs:true,show_remaining:true,...config,mode:config.mode||'full',title:config.title||'EDF Zen Flex'};this._signature=null;this.render();}
  set hass(hass){this._hass=hass;this.render();}
  getCardSize(){return this.config?.mode==='compact'?5:13;}
  static getStubConfig(){return {type:'custom:zen-flex-card',mode:'full'};}
  static getConfigElement(){return document.createElement('zen-flex-card-editor');}
  render(){
    if(!this.config||!this._hass)return;
    const id=this.config.entity||Object.keys(this._hass.states).find(k=>this._hass.states[k].attributes.zen_flex_card);
    const state=this._hass.states[id],a=state?.attributes||{};
    const signature=JSON.stringify([id,state,this.config,this._month]);if(signature===this._signature)return;this._signature=signature;
    const root=this.shadowRoot;
    if(!root.firstChild){root.innerHTML=`<style>
      :host{display:block}ha-card{padding:22px;overflow:hidden;background:var(--ha-card-background,var(--card-background-color));color:var(--primary-text-color)}
      header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.brand{font-weight:700;font-size:19px;letter-spacing:-.3px}.sub{font-size:12px;color:var(--secondary-text-color);margin-top:5px}
      .days{display:grid;grid-template-columns:1fr 1fr;gap:12px}.day{border-radius:18px;padding:18px 12px;background:var(--secondary-background-color);border:1px solid var(--divider-color)}
      .day.eco{background:rgba(34,160,109,.12)}.day.sobriete{background:rgba(227,80,80,.13)}.day.bonus{background:rgba(65,132,229,.13)}.label{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--secondary-text-color)}
      .status{font-weight:750;font-size:24px;margin:12px 0 6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--disabled-text-color);margin-right:7px}.eco .dot{background:#22a06d}.sobriete .dot{background:#e35050}.bonus .dot{background:#4184e5}
      .date{font-size:12px;color:var(--secondary-text-color)}.counts{display:flex;gap:8px;margin:18px 0}.count{flex:1;border:1px solid var(--divider-color);border-radius:12px;padding:12px 6px;text-align:center}.number{font-size:22px;font-weight:700}.count small{display:block;margin-top:5px;color:var(--secondary-text-color)}
      button{color:inherit;background:none;border:1px solid var(--divider-color);border-radius:10px;cursor:pointer;font:inherit;padding:8px 12px;touch-action:manipulation}button:focus-visible{outline:2px solid var(--primary-color)}
      .monthbar{display:flex;justify-content:space-between;align-items:center;margin:20px 0 12px}.monthname{font-size:15px;font-weight:600;text-transform:capitalize}.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;text-align:center}.weekday{font-size:11px;color:var(--secondary-text-color);padding:8px 0}.cell{padding:9px 0;border-radius:10px;font-size:13px;background:var(--secondary-background-color)}.cell.eco{background:rgba(34,160,109,.2)}.cell.sobriete{background:rgba(227,80,80,.25)}.cell.bonus{background:rgba(65,132,229,.23)}.cell.current{outline:2px solid var(--primary-color)}.cell.unknown{color:var(--disabled-text-color)}
      .foot{font-size:11px;line-height:1.6;color:var(--secondary-text-color);margin-top:15px}.warning{color:var(--error-color);margin-top:12px;font-size:13px}.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-top:14px}
      .remaining,.pricepanel{border:1px solid var(--divider-color);border-radius:14px;padding:14px;margin-top:14px}.remaining-head,.pricehead{display:flex;justify-content:space-between;align-items:center;gap:10px}.remaining-value,.pricevalue{font-size:22px;font-weight:700}.remaining-note,.tariff-note{font-size:12px;line-height:1.5;color:var(--secondary-text-color);margin-top:8px}.rate-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:12px}.rate-table th,.rate-table td{padding:9px 3px;text-align:right;border-top:1px solid var(--divider-color)}.rate-table th:first-child,.rate-table td:first-child{text-align:left}.badge{font-size:11px;padding:3px 6px;border-radius:6px;background:var(--secondary-background-color)}.tariff-source{overflow-wrap:anywhere;font-size:11px;color:var(--secondary-text-color);margin-top:8px}.rate-highlight{color:var(--primary-color);font-weight:700}[hidden]{display:none!important}
      :host{--zf-green:#168765;--zf-red:#d34b59;--zf-blue:#397ed1}ha-card{border-radius:24px;padding:24px;border:1px solid var(--divider-color);box-shadow:0 4px 20px rgba(20,40,65,.05)}header{margin-bottom:22px}.brand{font-size:22px;letter-spacing:-.7px}.sub{letter-spacing:1.4px;font-size:10px}.refresh{border-radius:50%;width:40px;height:40px;padding:0;font-size:23px}.day{padding:20px 16px;border:0;position:relative;overflow:hidden}.day:after{content:'';position:absolute;width:80px;height:80px;right:-32px;top:-32px;border:15px solid currentColor;border-radius:50%;opacity:.045;pointer-events:none}.day.eco{color:var(--zf-green);background:linear-gradient(135deg,rgba(34,160,109,.16),rgba(34,160,109,.04))}.day.sobriete{color:var(--zf-red);background:linear-gradient(135deg,rgba(227,80,80,.17),rgba(227,80,80,.04))}.day.bonus{color:var(--zf-blue);background:linear-gradient(135deg,rgba(65,132,229,.17),rgba(65,132,229,.04))}.status{font-size:27px;letter-spacing:-.6px}.status ha-icon{--mdc-icon-size:32px!important;margin-right:10px!important}.rate-table ha-icon{--mdc-icon-size:24px!important}.counts{gap:0;border-bottom:1px solid var(--divider-color);padding-bottom:16px}.count{border:0;border-radius:0}.count+.count{border-left:1px solid var(--divider-color)}.count small{font-size:12px;display:flex;align-items:center;justify-content:center;gap:3px;line-height:1.35}.count small ha-icon{--mdc-icon-size:28px!important;margin-right:5px!important}.pricepanel{background:linear-gradient(125deg,rgba(63,125,190,.09),transparent);border:0;padding:18px}.pricehead{align-items:flex-start;flex-direction:column;gap:8px}.pricevalue{font-size:30px;letter-spacing:-1px;line-height:1.2}.badge{background:var(--primary-color);color:var(--text-primary-color,#fff);margin-left:4px}.rate-table{font-variant-numeric:tabular-nums;font-size:14px}.remaining{border:0;padding:14px 0}.remaining-head>span:first-child{font-size:13px;max-width:65%}.remaining-value{white-space:nowrap;color:var(--zf-red)}.remaining-note{font-size:11px}.calendar{border-top:1px solid var(--divider-color);margin-top:18px}.cell{font-variant-numeric:tabular-nums}.legend{font-size:11px;gap:10px}.historypanel{margin-top:20px;padding-top:18px;border-top:1px solid var(--divider-color)}.historytitle{font-size:15px;font-weight:650;margin-bottom:5px}.historysubtitle{font-size:11px;color:var(--secondary-text-color);margin-bottom:12px}.historyrow{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--divider-color);font-size:13px}.historyrow:last-child{border-bottom:0}.historylabel{white-space:nowrap;font-weight:600}.historyrow.eco .historylabel{color:var(--zf-green)}.historyrow.sobriete .historylabel{color:var(--zf-red)}.historyrow.bonus .historylabel{color:var(--zf-blue)}.historymeta{font-size:10px;color:var(--secondary-text-color);margin-top:3px}.historyempty{font-size:13px;line-height:1.6;color:var(--secondary-text-color);padding:12px 0}.tariff-source{font-size:10px}.foot{border-top:1px solid var(--divider-color);padding-top:12px}
      .refresh-icon{display:inline-block;line-height:1;transform-origin:center}.refresh.busy .refresh-icon{animation:zen-flex-spin .8s linear infinite}.refresh:disabled{cursor:wait;opacity:.65}@keyframes zen-flex-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.refresh.busy .refresh-icon{animation:none}.refresh.busy{opacity:.45}}
      .counts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border-bottom:0;padding:0}.count,.count+.count{border:0;border-radius:12px;padding:13px 8px;background:var(--secondary-background-color)}.count.bonus{grid-column:1/-1}.count.eco .number{color:var(--zf-green)}.count.sobriete .number{color:var(--zf-red)}.count.bonus .number{color:var(--zf-blue)}
      .remaining-note,.tariff-source,.foot{white-space:pre-line}.remaining{margin-top:0;padding-top:0}.remaining-note{line-height:1.7}.tariff-source{line-height:1.7}
      @media(max-width:350px){ha-card{padding:15px}.status{font-size:20px}.day{padding:15px 9px}}
      </style><ha-card><header><div><div class="brand"></div><div class="sub"></div></div><button type="button" class="refresh" aria-label="Actualiser EDF"><span class="refresh-icon" aria-hidden="true">↻</span></button></header><div class="days"></div><div class="warning"></div><div class="counts"></div><section class="remaining"><div class="remaining-note"></div></section><section class="pricepanel"><div class="pricehead"><span>Prix actuel TTC <span class="badge"></span></span><span class="pricevalue"></span></div><div class="tariff-note"></div><table class="rate-table"><thead><tr><th>€/kWh TTC</th><th>HC</th><th>HP</th></tr></thead><tbody></tbody></table></section><section class="calendar"><div class="monthbar"><button type="button" class="prev" aria-label="Mois précédent">‹</button><span class="monthname"></span><button type="button" class="next" aria-label="Mois suivant">›</button></div><div class="grid"></div><div class="legend"><span class="eco"><i class="dot"></i>Éco</span><span class="sobriete"><i class="dot"></i>Sobriété</span><span class="bonus"><i class="dot"></i>Bonus</span><span>Gris : inconnu</span></div></section></ha-card>`;
      root.querySelector('.prev').onclick=()=>this.changeMonth(-1);root.querySelector('.next').onclick=()=>this.changeMonth(1);
      root.querySelector('.refresh').onclick=async()=>{
        if(!this._entity||this._refreshing)return;
        this._refreshing=true;
        const b=root.querySelector('.refresh');
        b.disabled=true;b.classList.add('busy');b.setAttribute('aria-busy','true');b.setAttribute('aria-label','Actualisation en cours');
        const visibleCycle=new Promise(resolve=>setTimeout(resolve,600));
        try{await this._hass.callService('homeassistant','update_entity',{entity_id:this._entity});}
        catch(e){root.querySelector('.warning').textContent=`Actualisation impossible : ${e.message||e}`;}
        finally{await visibleCycle;this._refreshing=false;b.disabled=false;b.classList.remove('busy');b.removeAttribute('aria-busy');b.setAttribute('aria-label','Actualiser EDF');}
      };
    }
    this._entity=id;
    root.querySelector('.brand').textContent=this.config.title;
    root.querySelector('.sub').textContent=`CALENDRIER ÉNERGIE · ${a.year||'—'}`;
    root.querySelector('.warning').textContent=!state?'Ajoutez l’intégration EDF Zen Flex.':['unavailable','unknown'].includes(state.state)?'Données EDF indisponibles — dernière observation affichée dans le calendrier.':'';
    const days=root.querySelector('.days');days.replaceChildren();
    for(const [label,status,date] of [['Aujourd’hui',state?.state,a.date],['Demain',state?.state==='unavailable'?null:a.tomorrow,a.tomorrow_date]]){
      const d=document.createElement('div');d.className=`day ${LABELS[status]?status:''}`;
      const l=document.createElement('div');l.className='label';l.textContent=label;
      const s=document.createElement('div');s.className='status';const dot=document.createElement('i');dot.className='dot';if(DAY_ICONS[status])s.append(ICON(DAY_ICONS[status]));else s.append(dot);s.append(document.createTextNode(LABELS[status]||'Inconnu'));
      const dt=document.createElement('div');dt.className='date';dt.textContent=this.dateLabel(date);d.append(l,s,dt);days.append(d);
    }
    const counts=root.querySelector('.counts');counts.replaceChildren();
    for(const [key,label,color] of [['eco_consumed','Éco passés','eco'],['eco_remaining','Éco restants','eco'],['sobriete_consumed','Sobriété passés','sobriete'],['sobriete_remaining','Sobriété restants','sobriete'],['bonus_consumed','Bonus passés','bonus']]){if(this.config.show_remaining===false&&key.endsWith('_remaining'))continue;const d=document.createElement('div');d.className=`count ${color}`;const n=document.createElement('div');n.className='number';n.textContent=a[key]??'—';const l=document.createElement('small');l.textContent=label;if(DAY_ICONS[color])l.prepend(ICON(DAY_ICONS[color]));d.append(n,l);counts.append(d);}
    root.querySelector('.remaining').hidden=this.config.show_remaining===false;
    const quality=a.history_quality;
    const countNotes=[];
    if(quality==='incoherent')countNotes.push('Compteurs incohérents : vérifiez les options.');
    else if(quality!=='complet')countNotes.push(`Historique incomplet : ${a.missing_days??'—'} jour(s) manquant(s).`);
    if(a.bonus_history_quality==='incoherent')countNotes.push('Compteur Bonus incohérent.');
    else if(a.bonus_history_quality==='incomplet'&&quality==='complet')countNotes.push('Compteur initial Bonus à renseigner.');
    root.querySelector('.remaining-note').textContent=countNotes.join('\n');
    root.querySelector('.remaining').hidden=!countNotes.length;
    const tariffs=a.tariffs||{},rates=tariffs.rates||{};
    const fmt=value=>typeof value==='number'&&Number.isFinite(value)?value.toLocaleString('fr-FR',{minimumFractionDigits:4,maximumFractionDigits:4}):'—';
    root.querySelector('.pricepanel').hidden=this.config.show_tariffs===false;
    const badge=root.querySelector('.badge');badge.replaceChildren();const dayKey=state?.state==='bonus'?'eco':state?.state;const priceIcon=RATE_ICONS[`${dayKey}_${tariffs.period}`];if(priceIcon)badge.append(ICON(priceIcon));badge.append(document.createTextNode(tariffs.period?.toUpperCase()||'—'));
    root.querySelector('.pricevalue').textContent=`${fmt(tariffs.current_price)} €/kWh`;
    const tariffNote=root.querySelector('.tariff-note');
    tariffNote.textContent=!tariffs.confirmed?'Tarifs à confirmer dans les options.':!tariffs.active?'Tarifs pas encore applicables.':tariffs.current_price==null?'Statut EDF du jour indisponible.':'';
    tariffNote.hidden=!tariffNote.textContent;
    const table=root.querySelector('.rate-table');table.hidden=this.config.mode==='compact';
    const tbody=table.querySelector('tbody');tbody.replaceChildren();
    for(const [key,label] of [['eco','Éco / Bonus'],['sobriete','Sobriété']]){const row=document.createElement('tr');const title=document.createElement('td');title.textContent=label;if(DAY_ICONS[key])title.prepend(ICON(DAY_ICONS[key]));row.append(title);for(const period of ['hc','hp']){const cell=document.createElement('td');cell.textContent=fmt(rates[`${key}_${period}`]);cell.prepend(ICON(RATE_ICONS[`${key}_${period}`]));if(tariffs.current_price!=null&&period===tariffs.period&&(state?.state===key||(key==='eco'&&state?.state==='bonus')))cell.className='rate-highlight';row.append(cell);}tbody.append(row);}
    root.querySelector('.calendar').hidden=this.config.mode==='compact';
    if(!this._month){const date=a.date||new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris'}).format(new Date());this._month=date.slice(0,7);}
    const [year,month]=this._month.split('-').map(Number);
    root.querySelector('.monthname').textContent=new Date(year,month-1,1).toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    const grid=root.querySelector('.grid');grid.replaceChildren();for(const name of ['L','M','M','J','V','S','D']){const d=document.createElement('div');d.className='weekday';d.textContent=name;grid.append(d);}
    const offset=(new Date(year,month-1,1).getDay()+6)%7;for(let i=0;i<offset;i++)grid.append(document.createElement('span'));
    for(let day=1;day<=new Date(year,month,0).getDate();day++){const key=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,status=a.history?.[key]?.status;const d=document.createElement('div');d.className=`cell ${LABELS[status]?status:'unknown'} ${key===a.date?'current':''}`;d.textContent=day;d.title=`${this.dateLabel(key)} : ${LABELS[status]||'Inconnu'}`;grid.append(d);}

  }
  dateLabel(date){return date?new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}):'Date inconnue';}
  changeMonth(delta){const [y,m]=this._month.split('-').map(Number);const date=new Date(y,m-1+delta,1);this._month=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;this.render();}
}
class ZenFlexEditor extends HTMLElement{
  setConfig(config){this.config=config;this.render();}set hass(hass){this._hass=hass;}
  render(){this.replaceChildren();for(const [key,label] of [['title','Titre'],['entity','Entité Aujourd’hui (vide = automatique)'],['mode','Mode']]){const wrapper=document.createElement('label');wrapper.style.cssText='display:block;margin:14px 0';wrapper.textContent=label;const input=document.createElement(key==='mode'?'select':'input');input.style.cssText='display:block;width:100%;padding:10px;box-sizing:border-box';if(key==='mode')for(const v of ['full','compact']){const o=document.createElement('option');o.value=v;o.textContent=v==='full'?'Complet':'Compact';input.append(o);}input.value=this.config[key]||(key==='mode'?'full':'');input.onchange=()=>{this.config={...this.config,[key]:input.value};this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.config},bubbles:true,composed:true}));};wrapper.append(input);this.append(wrapper);}for(const [key,label] of [['show_tariffs','Afficher les tarifs'],['show_remaining','Afficher les jours restants']]){const wrapper=document.createElement('label');wrapper.style.cssText='display:block;margin:14px 0';const input=document.createElement('input');input.type='checkbox';input.checked=this.config[key]!==false;input.onchange=()=>{this.config={...this.config,[key]:input.checked};this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.config},bubbles:true,composed:true}));};wrapper.append(input,document.createTextNode(` ${label}`));this.append(wrapper);}}
}
if(!customElements.get('zen-flex-card'))customElements.define('zen-flex-card',ZenFlexCard);
if(!customElements.get('zen-flex-card-editor'))customElements.define('zen-flex-card-editor',ZenFlexEditor);
window.customCards=window.customCards||[];window.customCards.push({type:'zen-flex-card',name:'EDF Zen Flex',description:'Calendrier, tarifs et jours Sobriété restants',preview:true});
