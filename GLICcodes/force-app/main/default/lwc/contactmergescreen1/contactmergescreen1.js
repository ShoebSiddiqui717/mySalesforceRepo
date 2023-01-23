import { api, LightningElement, track } from 'lwc';
import  contactList from '@salesforce/apex/ContactMergeController.getContactRecords';
import next from '@salesforce/label/c.CM_Next';
import searchContact from '@salesforce/label/c.CM_Search_Contact';
import refresh from '@salesforce/label/c.CM_Refresh';
import enterhere from '@salesforce/label/c.CM_Enter_Here';
import title from '@salesforce/label/c.CM_Title';
import contactName from '@salesforce/label/c.CM_Contact_Name';
import recordType from '@salesforce/label/c.CM_Record_Type';
import email from '@salesforce/label/c.CM_Email';
import phone from '@salesforce/label/c.CM_Phone';
import rgo from '@salesforce/label/c.CM_RGO';
import producerTier from '@salesforce/label/c.CM_Producer_Tier';
import sgsProducerTier from '@salesforce/label/c.CM_SGS_Producer_Tier';
import status from '@salesforce/label/c.CM_Status';
import minRecordSelect from '@salesforce/label/c.CM_Minimum_records_message';
import maxRecordSelect from '@salesforce/label/c.CM_maximum_records_message';
import planholder from  '@salesforce/label/c.CM_Planholder_Broker';
const DELAY = 500;

export default class Contactmergescreen1 extends LightningElement {

    @track contactNameToSearch;
    @track contactData;
    @track error;
    delayTimeout;
    @track selectedContactIds;
    @api searchtextfrompreviousbutton;

    label={
        next,searchContact,refresh,enterhere,title,contactName,recordType,email,phone,rgo,producerTier,sgsProducerTier,status,
        minRecordSelect,maxRecordSelect,planholder
    }
    connectedCallback(){

        this.initializeVariables();
        if(this.searchtextfrompreviousbutton){
            this.fetchObjectData();
        }
    }

    initializeVariables(){

        this.contactNameToSearch ='';
        this.selectedContactIds=[];
        this.error='';
        this.contactData='';
    }
   
    //queries the backend for user typed input    
    handleContactInput(event){
        
        window.clearTimeout(this.delayTimeout);
        const searchkey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.contactNameToSearch = searchkey;
            this.fetchContactRecords();
        }, DELAY);
        
    }

//fetch contact data from apex    
    fetchContactRecords(){
        contactList({contactName:this.contactNameToSearch})
        .then(result=>{
            this.contactData = result;
            this.error = undefined;
        })
        .catch(error=>{
            this.contactData = undefined;
            this.error = error;
            console.log('Error Fetching Contact Data'+JSON.stringify(this.error));
        })
        
    }

    //handles the file list of checkbox. The final list of selected contacts are in : selectedContactIds
    handleCheckboxSelection(event){
        
        this.error ='';

        if(event.target.checked){
            this.selectedContactIds.push(event.target.value);
        }else if(!event.target.checked){
           this.selectedContactIds = this.selectedContactIds.filter(function(el){return el !== event.target.value});
        }
    }

//Next Button Click     
    handleNext(){

        if(this.selectedContactIds.length >=2 && this.selectedContactIds.length<=6 ){
            let selectedContIds = this.selectedContactIds;
            let namesearch = this.contactNameToSearch;
//make changes if required. Changed the screen1data attributes    
            let screen1data = {
                contactids:selectedContIds,
                searchtext:namesearch
            };

            const selectedEvent = new CustomEvent('next', { detail: screen1data });
            this.dispatchEvent(selectedEvent);
        }else if(this.selectedContactIds.length < 2){
            this.error = this.label.minRecordSelect;
        }else if(this.selectedContactIds.length >= 7){
            this.error = this.label.maxRecordSelect;
        }
      
    }

//Handle Page Refresh    
    handleRefresh(){
  
        this.template.querySelector('form').reset();
        //this.connectedCallback();
        this.initializeVariables();
        //this.template.querySelector('form').reset();
    }

//Only called when we come from Contactmergescreen2 to Contactmergescreen1 by clicking 'Previous' on Contactmergescreen1. 
//Based on the searchkey , it re-fetches the data from apex.    
    fetchObjectData(){
    
        this.contactNameToSearch= this.searchtextfrompreviousbutton;

        this.delayTimeout = setTimeout(() => {
            var inp=this.template.querySelectorAll("lightning-input");
            inp.forEach(function(element){
                if(element.type==="text" ){ 
                    element.value = this.contactNameToSearch;
                }
                
            },this);
            this.fetchContactRecords();
        }, DELAY);
       
    }
}