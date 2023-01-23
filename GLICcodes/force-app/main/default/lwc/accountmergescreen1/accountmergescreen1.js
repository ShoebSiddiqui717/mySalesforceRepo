import { api, LightningElement, track } from 'lwc';
import  accountList from '@salesforce/apex/accountMergeController.getAccountRecords';
import inputPlaceholder from '@salesforce/label/c.AM_Screen1Placeholder';
import inputLabel from '@salesforce/label/c.AM_InputText';
import accountNameHeader from '@salesforce/label/c.AM_Screen1_tableheader1';
import siteHeader from '@salesforce/label/c.AM_Screen1_tableheader2';
import ownerHeader from '@salesforce/label/c.AM_Screen1_tableheader3';
import nextButton from '@salesforce/label/c.AM_nextButton';
import refreshButton from '@salesforce/label/c.AM_refreshButton';
import errorMessage2 from '@salesforce/label/c.AM_errorMessage2';
import errorMessage3 from '@salesforce/label/c.AM_errorMessage3';
import recordTypeName from '@salesforce/label/c.AM_Screen1_tableheader4';
import mailingCity from '@salesforce/label/c.AM_Screen1_tableheader5';
import mailingState from '@salesforce/label/c.AM_Screen1_tableheader6';
import phone from '@salesforce/label/c.AM_Screen1_tableheader7';
import rgo from '@salesforce/label/c.AM_Screen1_tableheader8';
import smallmarket from '@salesforce/label/c.AM_Screen1_tableheader10';
import coremarket from '@salesforce/label/c.AM_Screen1_tableheader11';
import largemarket from '@salesforce/label/c.AM_Screen1_tableheader12';
import status from '@salesforce/label/c.AM_Screen1_tableheader13';

const DELAY = 500;

export default class Accountmergescreen1 extends LightningElement {

    @track accountNameToSearch;
    @track accountData;
    @track error;
    delayTimeout;
    @track selectedAccountIds;
    @api searchtextfrompreviousbutton;

    label={
        inputPlaceholder,inputLabel,accountNameHeader,siteHeader,ownerHeader,nextButton,refreshButton,errorMessage2,errorMessage3,recordTypeName,mailingCity,mailingState,phone,rgo,smallmarket,
        coremarket,largemarket,status
    }

    connectedCallback(){

        this.initializeVariables();
        if(this.searchtextfrompreviousbutton){
            this.fetchObjectData();
        }
    }

    initializeVariables(){

        this.accountNameToSearch ='';
        this.selectedAccountIds=[];
        this.error='';
        this.accountData='';
    }

//queries the backend for user typed input    
    handleAccountInput(event){
        
        window.clearTimeout(this.delayTimeout);
        const searchkey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.accountNameToSearch = searchkey;
            this.fetchAccountRecords();
        }, DELAY);
    }

//fetch account data from apex    
    fetchAccountRecords(){
        accountList({accountName:this.accountNameToSearch})
        .then(result=>{
            this.accountData = result;
            this.error = undefined;
        })
        .catch(error=>{
            this.accountData = undefined;
            this.error = error;
            console.log('Error Fetching Account Data'+JSON.stringify(this.error));
        })
        
    }

//handles the file list of checkbox. The final list of selected accounts are in : selectedAccountIds
    handleCheckboxSelection(event){
        
        this.error ='';

        if(event.target.checked){
            this.selectedAccountIds.push(event.target.value);
        }else if(!event.target.checked){
           this.selectedAccountIds = this.selectedAccountIds.filter(function(el){return el !== event.target.value});
        }
    }

//Next Button Click     
    handleNext(){

        if(this.selectedAccountIds.length >=2 && this.selectedAccountIds.length<=6 ){
            let selectedAccIds = this.selectedAccountIds;
            let namesearch = this.accountNameToSearch;
    
            let screen1data = {
                accountids:selectedAccIds,
                searchtext:namesearch
            };

            const selectedEvent = new CustomEvent('next', { detail: screen1data });
            this.dispatchEvent(selectedEvent);
        }else if(this.selectedAccountIds.length < 2){
            this.error = this.label.errorMessage2;
        }else if(this.selectedAccountIds.length >= 7){
            this.error = this.label.errorMessage3;
        }
      
    }

//Handle Page Refresh    
    handleRefresh(){
  
        this.template.querySelector('form').reset();
        this.connectedCallback();
    }

//Only called when we come from Accountmergescreen2 to Accountmergescreen1 by clicking 'Previous' on Accountmergescreen1. 
//Based on the searchkey , it re-fetches the data from apex.    
    fetchObjectData(){
    
        this.accountNameToSearch= this.searchtextfrompreviousbutton;

        this.delayTimeout = setTimeout(() => {
            var inp=this.template.querySelectorAll("lightning-input");
            inp.forEach(function(element){
                if(element.type==="text" ){ 
                    element.value = this.accountNameToSearch;
                }
                
            },this);
            this.fetchAccountRecords();
        }, DELAY);
       
    }
    
}