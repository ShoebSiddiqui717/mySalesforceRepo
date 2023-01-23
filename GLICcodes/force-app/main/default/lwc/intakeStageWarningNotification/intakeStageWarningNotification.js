import { LightningElement,api,track } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled }  from 'lightning/empApi';
import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import STAGEVALUE_FIELD from '@salesforce/schema/Opportunity.StageName';
import createWIs from '@salesforce/apex/OpportunityIntakeStageController.createWIs';

export default class Lwc_platfromEventEg1 extends LightningElement {

    //channelName = '/event/User_Message__e';
    channelName = '/event/UserNotificationOppStageChange__e';
    subscription = {};
    @track OppInfo = {};
    showModal = false;
    OppID;
    CStage;
    PStage;
    msg;
    @api recordId;
    applySpinner = false;


    connectedCallback() {       
        console.log('inside connectedCallback');
        this.handleSubscribe();
    }

    handleSubscribe() {
        subscribe(this.channelName, -1, this.messageCallback).then(response => {
            console.log('Subscription Request sent to :  ', JSON.stringify(response.channelName));
        });
    }

    messageCallback = (response) => {
            console.log('inside messageCallback');
                const thisReference = this;
                var obj = JSON.parse(JSON.stringify(response));
                //var OId = obj.data.payload.TestRecodId__c;
                var OId = obj.data.payload.RecordId__c;
                var cs = obj.data.payload.Current_Stage_Value__c;
                //var ps = obj.data.payload.Previous_Stage_Value__c;
                var ps = obj.data.payload.Previous_Stage_Value_c__c;
                var mssg = obj.data.payload.Message__c;
                
                
                if(this.recordId === OId){
                    this.showModal = true;
                }
                
                
                this.OppID = OId;
                this.CStage=cs;
                this.PStage=ps;
                this.msg = mssg;
            };

           
    async invokeCreateWIs(event){
        console.log('Opp-->',this.OppID);
        console.log('stage-->',this.CStage);
        this.applySpinner = true;
        await createWIs({ opptId : this.OppID}).then(
            result =>{
                console.log('WI created');
                eval("$A.get('e.force:refreshView').fire();");
                this.applySpinner = false;
                this.showModal = false;
            }
        );
    }

    UpdatePreviousHandler(){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.OppID;
        fields[STAGEVALUE_FIELD.fieldApiName] = this.PStage;
        const recordInput = { fields };
        updateRecord(recordInput).then(updated => {
            this.showModal = false;
        }).catch(error =>{
        })
    }

    
}