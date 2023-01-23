import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ConvertedConId from "@salesforce/schema/Lead.ConvertedContactId";
import ConvertedAccId from "@salesforce/schema/Lead.ConvertedAccountId";
import ConvertedCon from "@salesforce/schema/Lead.ConvertedContact.Name";
import ConvertedAcc from "@salesforce/schema/Lead.ConvertedAccount.Name";
import ConvertedAccType from "@salesforce/schema/Lead.ConvertedAccount.Type";
import ConvertedOpp from "@salesforce/schema/Lead.ConvertedOpportunity.Name";
import ConvertedConT from "@salesforce/schema/Lead.ConvertedContact.Title";
import ConvertedConP from "@salesforce/schema/Lead.ConvertedContact.Phone";
import ConvertedConeml from "@salesforce/schema/Lead.ConvertedContact.Email";
import ConvertedAccW from "@salesforce/schema/Lead.ConvertedAccount.Website"
import ConvertedAccSite from "@salesforce/schema/Lead.ConvertedAccount.Site"
// Opp new fields added
import ConvertOppStage from "@salesforce/schema/Lead.ConvertedOpportunity.StageName";
import ConvertOppEffectiveDate from "@salesforce/schema/Lead.ConvertedOpportunity.CloseDate";
import ConvertOppBrokerFirm from "@salesforce/schema/Lead.ConvertedOpportunity.Broker_Firm_Name__c";
import ConvertOppNumberofLives from "@salesforce/schema/Lead.ConvertedOpportunity.Number_Of_Lives_Text__c";

import ConvertedOppC from "@salesforce/schema/Lead.ConvertedOpportunity.CloseDate";
import ConvertedOppNOL from "@salesforce/schema/Lead.ConvertedOpportunity.Amount";
import ConvertedOppBID from "@salesforce/schema/Lead.ConvertedOpportunity.Owner.Name";
import ConvertedOppBF from "@salesforce/schema/Lead.ConvertedOpportunity.Broker_Firm_Name__c";
// import ConvertedOppS from "@salesforce/schema/Lead.ConvertedOpportunity.Status__c";
import ConvertedAccP from "@salesforce/schema/Lead.ConvertedAccount.Phone";
import ConvertedAccO from "@salesforce/schema/Lead.ConvertedAccount.Owner.Name";
// import ConvertedConMA from "@salesforce/schema/Lead.ConvertedContact.MailingAddress";
import ConvertedConS from "@salesforce/schema/Lead.ConvertedContact.Status__c";
import ConvertedConM from "@salesforce/schema/Lead.ConvertedContact.MobilePhone";
import ConvertedOppId from '@salesforce/schema/Lead.ConvertedOpportunityId';
import subtype from '@salesforce/schema/Lead.Lead_SubType__c';
import planholderidfromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__c';
import planholderNamefromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Name';
import planholderTypefromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Type';
import planholderPhonefromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Phone';
import planholderWebsitefromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Website';
import planholderOwnerfromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Owner.Name';
import planholderSitefromopp from '@salesforce/schema/Lead.ConvertedOpportunity.Planholder_Name__r.Site';
// Account Fields Added
import ConvertedAccBilling_Street from '@salesforce/schema/Lead.ConvertedAccount.BillingStreet';
import ConvertedAccBilling_City from '@salesforce/schema/Lead.ConvertedAccount.BillingCity';
import ConvertedAccBilling_Country from '@salesforce/schema/Lead.ConvertedAccount.BillingCountry';
import ConvertedAccBilling_PostalCode from '@salesforce/schema/Lead.ConvertedAccount.BillingPostalCode';
import ConvertedAccBilling_State from '@salesforce/schema/Lead.ConvertedAccount.BillingState';
import ConvertedAccStatus__c from '@salesforce/schema/Lead.ConvertedAccount.Status__c';
import convertaccRecordtype from '@salesforce/schema/Lead.ConvertedAccount.RecordType.Name';
import convertaccRGO from '@salesforce/schema/Lead.ConvertedAccount.RGO__c';
//contact fields added
import convertcontRecordtype from '@salesforce/schema/Lead.ConvertedContact.RecordType.Name';
import convertcontStatus from '@salesforce/schema/Lead.ConvertedContact.Status__c';


const fields = [
    ConvertedCon,
    ConvertedAcc,
    ConvertedOpp,
    ConvertedConId,
    ConvertedAccId,
    ConvertedAccType,
    ConvertedConT,
    ConvertedConP,
    // new contact fields added
    convertcontRecordtype,
    convertcontStatus,

    ConvertedAccW,
    ConvertedAccSite,
    // new Account fields Added
    ConvertedAccBilling_Street,
    ConvertedAccBilling_City,
    ConvertedAccBilling_Country,
    ConvertedAccBilling_PostalCode,
    ConvertedAccBilling_State,
    ConvertedAccStatus__c,
    convertaccRecordtype,
    convertaccRGO,

    // new opp fields added
    ConvertOppStage,
    ConvertOppEffectiveDate,
    ConvertOppBrokerFirm,
    ConvertOppNumberofLives,

    ConvertedOppC,
    ConvertedOppNOL,
    ConvertedOppBID,
    ConvertedOppBF,
    //ConvertedOppS,
    ConvertedAccO,
    ConvertedConS,
    ConvertedAccP,
    ConvertedConeml,
    ConvertedConM,
    ConvertedOppId,
    subtype,
    planholderidfromopp,
    planholderNamefromopp,
    planholderTypefromopp,
    planholderPhonefromopp,
    planholderWebsitefromopp,
    planholderOwnerfromopp,
    planholderSitefromopp
     ];

export default class Modal extends NavigationMixin(LightningElement) {
    @api recordId;
    showplanholder;
    goToLead() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Lead',
            actionName: 'home',
        },
    });
}
navigateToTask() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Task',
            actionName: 'new',
        },
    });
}


@wire(getRecord, { recordId: '$recordId', fields })
lead;
get sub() {
    
    console.log('type'+getFieldValue(this.lead.data, subtype));
  if(getFieldValue(this.lead.data, subtype) =='Planholder'){
    console.log('inside');
    this.showplanholder =true;
  }
    return getFieldValue(this.lead.data, subtype);
    
}
get planholderid() {
    return getFieldValue(this.lead.data, planholderidfromopp);
}
get planholderName() {
    return getFieldValue(this.lead.data, planholderNamefromopp);
}

get convertcon() {
    return getFieldValue(this.lead.data, ConvertedCon);
}
get convertacc() {
    var acid;
    if(getFieldValue(this.lead.data, subtype) =='Planholder'){
        this.acid 
    }
    return getFieldValue(this.lead.data, ConvertedAcc);
}
get convertopp() {
    return getFieldValue(this.lead.data, ConvertedOpp);
}

get convertacctype() {
    return getFieldValue(this.lead.data, ConvertedAccType);
}
get convertcont() {
    return getFieldValue(this.lead.data, ConvertedConT);
}
get convertconp() {
    return getFieldValue(this.lead.data, ConvertedConP);
}
//Added regarding GS3-821
get convertconm(){
    return getFieldValue(this.lead.data, ConvertedConM);
}
get convertconemail() {
  return getFieldValue(this.lead.data, ConvertedConeml);
}
get convertaccw() {
    return getFieldValue(this.lead.data, ConvertedAccW);
}
get convertaccs() {
  return getFieldValue(this.lead.data, ConvertedAccSite);
}
// account methods added
get convertaccMailing() {
    let str = getFieldValue(this.lead.data, ConvertedAccBilling_Street) ? getFieldValue(this.lead.data, ConvertedAccBilling_Street)+', ' : '';
        str += getFieldValue(this.lead.data, ConvertedAccBilling_City) ? getFieldValue(this.lead.data, ConvertedAccBilling_City)+', ' : '';
        str += getFieldValue(this.lead.data, ConvertedAccBilling_State) ? getFieldValue(this.lead.data, ConvertedAccBilling_State)+', ' : '';
        str += getFieldValue(this.lead.data, ConvertedAccBilling_PostalCode) ? getFieldValue(this.lead.data, ConvertedAccBilling_PostalCode)+', ' : '';
        str += getFieldValue(this.lead.data, ConvertedAccBilling_Country) ? getFieldValue(this.lead.data, ConvertedAccBilling_Country) : '';
    return str;
}
get convertaccRecordtype(){
    return getFieldValue(this.lead.data, convertaccRecordtype);
}
get ConvertedAccStatus__c(){
    return getFieldValue(this.lead.data, ConvertedAccStatus__c);
}
get convertaccRGO(){
    return getFieldValue(this.lead.data, convertaccRGO);
}
// contact methods added
get convertcontRecordtype(){
    return getFieldValue(this.lead.data, convertcontRecordtype);
}
get convertcontStatus(){
    return getFieldValue(this.lead.data, convertcontStatus);
}

// Opp New fields added
get ConvertOppStage(){
    return getFieldValue(this.lead.data, ConvertOppStage);
}

get ConvertOppEffectiveDate(){
    return getFieldValue(this.lead.data, ConvertOppEffectiveDate);
}

get ConvertOppBrokerFirm(){
    return getFieldValue(this.lead.data, ConvertOppBrokerFirm);
}

get ConvertOppNumberofLives(){
    return getFieldValue(this.lead.data, ConvertOppNumberofLives);
}

get ConvertOppC() {
    return getFieldValue(this.lead.data, ConvertedOppC);
}
get ConvertOppNOL() {
    return getFieldValue(this.lead.data, ConvertedOppNOL);
}
get ConvertOppBID() {
    return getFieldValue(this.lead.data, ConvertedOppBID);
}
get ConvertOppBF() {
    return getFieldValue(this.lead.data, ConvertedOppBF);
}
// get ConvertOppS() {
//     return getFieldValue(this.lead.data, ConvertedOppS);
// }
get ConvertAccP() {
    return getFieldValue(this.lead.data, ConvertedAccP);
}
get ConvertAccO() {
    return getFieldValue(this.lead.data, ConvertedAccO);
}
// get ConvertConMA() {
//     return getFieldValue(this.lead.data, ConvertedConMA);
// }
get ConvertConS() {
    return getFieldValue(this.lead.data, ConvertedConS);
}

get conId() {
    return getFieldValue(this.lead.data, ConvertedConId);
}
get accId() {
    return getFieldValue(this.lead.data, ConvertedAccId);
}
get oppId() {
    return getFieldValue(this.lead.data, ConvertedOppId);
}
get planTypefromopp() {
    return getFieldValue(this.lead.data, planholderTypefromopp);
}
get planPhonefromopp() {
    return getFieldValue(this.lead.data, planholderPhonefromopp);
}
get planWebsitefromopp() {
    return getFieldValue(this.lead.data, planholderWebsitefromopp);
}
get planOwnerfromopp() {
    return getFieldValue(this.lead.data, planholderOwnerfromopp);
}
get planSitefromopp() {
    return getFieldValue(this.lead.data, planholderSitefromopp);
}

baseUrl;

connectedCallback(){
    
    this.baseUrl = window.location.origin; 
   
  
 
}  

get goToAcc(){
    return this.baseUrl + "/" + this.accId;
}
get goToCon(){
    return this.baseUrl + "/" + this.conId;
}
get goToOpp(){
    return this.baseUrl + "/" + this.oppId;
}
get goToplanholder(){
    return this.baseUrl + "/" + this.planholderid;
}


}