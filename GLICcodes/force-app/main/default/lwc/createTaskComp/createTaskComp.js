import { api, LightningElement, track,wire } from 'lwc';
import accountRecMethod from '@salesforce/apex/CreateTaskCtrl.accountRecMethod';
import getType from '@salesforce/apex/CreateTaskCtrl.getType';
import getApproach from '@salesforce/apex/CreateTaskCtrl.getApproach';
import getWithwhom  from '@salesforce/apex/CreateTaskCtrl.getWithwhom';
import getStatus    from '@salesforce/apex/CreateTaskCtrl.getStatus';
import getPriority   from '@salesforce/apex/CreateTaskCtrl.getPriority';
import getTopic from '@salesforce/apex/CreateTaskCtrl.getTopic';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import uId from '@salesforce/user/Id';

import { NavigationMixin } from 'lightning/navigation';
const options = [
    {
        value: 'Initial Contact',
        label: 'Initial Contact'
    },
    {
        value: 'F/U Birthday',
        label: 'F/U Birthday'
    },
    {
        value: 'F/U 30 days',
        label: 'F/U 30 days'
    },
    {
        value: 'F/U Quote',
        label: 'F/U Quote'
    },
    {
        value: 'F/U Other',
        label: 'F/U Other'
    },
];

export default class createTaskComp extends NavigationMixin(LightningElement)  {
    options = options;

    selectedOptionValue;
    selectedOptionLabel;

    handleOptionChange(event) {
        this.selectedOptionValue = event.detail.value;
        this.selectedOptionLabel = event.detail.label;
        console.log('sub-'+this.selectedOptionValue);
        this.subject =this.selectedOptionValue;

    }
    handelSubjectchange1(event) {
       
        console.log('Subject1-'+event.detail.value);
        this.subject =event.detail.value;

    }
    
    @api recordId;
    @api taskType;
    userId = uId;

@track isDisableDuedate;
    ownerId;
    typelst;
    @track typePicklist = [];
    approachlst;
    @track approachPicklist = [];
    withwhomlst;
    @track withwhomPicklist = [];

    statuslst;
    @track statusPicklist = [];

    prioritylst;
    @track priorityPicklist = [];

    topiclst;
    @track topicPicklist = [];

    @api navigateToList;
    handleNavigation(){
       this.navigateToList('/'+this.recordId);
    }
    @track boolVisible = true;  

    @track dbtn;
    @track wbtn;
    @track mbtn;
    @track ybtn;


	connectedCallback() {
        console.log('tasktype-'+this.taskType);
        
        this.reletedtoid =this.recordId;
        this.isDisableDuedate =false;
        var today = new Date();

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var dayName = days[today.getDay()];

console.log(dayName);
if(dayName =='Sunday'){
    this.repeatOnW ='Su';
}
else if (dayName =='Monday'){
    this.repeatOnW1 ='M';
}
else if (dayName =='Tuesday'){
    this.repeatOnW2='T';
}
else if (dayName =='Wednesday'){
    this.repeatOnW3 ='W';
}
else if (dayName =='Thursday'){
    this.repeatOnW4 ='Th';
}
else if (dayName =='Friday'){
    this.repeatOnW5 ='F';
}
else if (dayName =='Saturday'){
    this.repeatOnW6 ='Sa';
}
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        console.log('todays date'+today);


        this.startDate =yyyy + '-' + mm + '-' + dd;

        var result1 = new Date(today);
        result1.setDate(result1.getDate() + 1);
        console.log('result date'+result1);

        var dd0 = String(result1.getDate()).padStart(2, '0');
        var mm0 = String(result1.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy0 = result1.getFullYear();
        this.endDate =yyyy0 + '-' + mm0 +'-' + dd0 ;
        this.startDateW =yyyy + '-' + mm + '-' + dd;
        var result = new Date(today);
        result.setDate(result.getDate() + 7);
        console.log('result date'+result);

        var dd1 = String(result.getDate()).padStart(2, '0');
        var mm1 = String(result.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy1 = result.getFullYear();
        this.endDateW =yyyy1 + '-' + mm1 + '-' + dd1;

        this.startDateM =yyyy + '-' + mm + '-' + dd;
        this.endDatM =yyyy + '-' + (parseFloat(mm) + parseFloat(1)) + '-'+dd  ;

        this.startDateY =yyyy + '-' + mm + '-' + dd;
        this.endDateY =(parseFloat(yyyy)) + (parseFloat(1)) + '-' + mm + '-' + dd;


        this.everySelected ='1';
        this.everySelecteW ='1';
        this.everySelectedM ='1';
        this.whenMonthSelected ='specificdays';
        this.dayMselected ='1';
        this.dayMTSelected ='First';
        this.repeatOnM ='Sunday';
        this.dayYSelected ='First';
        this.repeatOnY ='Sunday';
        this.MonthSelected ='January';

        this.repeatSelected ='everyday';
        this.repeatSelectedW ='everyweek';
        this.repeatSelectedM ='everymonth';
        this.whenYearSelected ='specificdate';
        this.dbtn ='brand';
        this.wbtn ='Neutral';
        this.mbtn ='Neutral';
        this.ybtn ='Neutral';

        this.seletedFrequency ='Daily';

        this.statusSelected ='Not Started';
        this.prioritySelected ='Normal';
        var dateVar = new Date();
        //Current Date 
        this.currentDate = new Date(dateVar.getTime() + dateVar.getTimezoneOffset()*60000).toISOString();
        this.dueDate =this.currentDate;
        this.fetchTypePicklist();
        this.fetchApproachPicklist();
        this.fetchWithwhomPicklist();
        this.fetchStatusPicklist();
        this.fetchPriorityPicklist();
        this.fetchTopicPicklist();
        this.boolVisible = true;  
        console.log('Id-'+this.recordId);

        if(this.recordId.startsWith("00Q") ){
            console.log('inside-'+this.recordId);

            this.boolVisible = false;  

        }
        if(this.taskType =='call'){
            this.statusSelected ='Completed';
            this.typeSelected ='Call';
        }

    }
    

    fetchTypePicklist() {
        getType()
            .then(result => {
                this.typelst = result;
                for (let i = 0; i < this.typelst.length; i++) {
                    this.typePicklist = [...this.typePicklist, { label: this.typelst[i], value: this.typelst[i] }];
                }
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.account = undefined;
            })
        }
        get typeOptions() {
            return this.typePicklist;
        }

    fetchApproachPicklist() {
            getApproach()
                .then(result => {
                    this.approachlst = result;
                    for (let i = 0; i < this.approachlst.length; i++) {
                        this.approachPicklist = [...this.approachPicklist, { label: this.approachlst[i], value: this.approachlst[i] }];
                    }
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.account = undefined;
                })
            }
            get approachOptions() {
                return this.approachPicklist;
            }

    fetchWithwhomPicklist() {
                getWithwhom()
                    .then(result => {
                        this.withwhomlst = result;
                        for (let i = 0; i < this.withwhomlst.length; i++) {
                            this.withwhomPicklist = [...this.withwhomPicklist, { label: this.withwhomlst[i], value: this.withwhomlst[i] }];
                        }
                        this.error = undefined;
                    })
                    .catch(error => {
                        this.error = error;
                        this.account = undefined;
                    })
                }
                get withwhomOptions() {
                    return this.withwhomPicklist;
                }
    fetchStatusPicklist() {
                    getStatus()
                        .then(result => {
                            this.statuslst = result;
                            for (let i = 0; i < this.statuslst.length; i++) {
                                this.statusPicklist = [...this.statusPicklist, { label: this.statuslst[i], value: this.statuslst[i] }];
                            }
                            this.error = undefined;
                        })
                        .catch(error => {
                            this.error = error;
                            this.account = undefined;
                        })
                    }
                    get statusOptions() {
                        return this.statusPicklist;
                    }
                    get repeatoptions() {
                        return [
                            { label: 'Every Day', value: 'everyday' },
                            { label: 'Every Other day', value: 'everyotherday' },
                            { label: 'Custom', value: 'custom' },
                        ];
                    }
                    get repeatoptions1() {
                        return [
                            { label: 'Every Week', value: 'everyweek' },
                            { label: 'Every Other day', value: 'everyotherday' },
                            { label: 'Custom', value: 'custom' },
                        ];
                    }
                    
                    get repeatoptions2() {
                        return [
                            { label: 'Every Month', value: 'everymonth' },
                            { label: 'Every Other Month', value: 'everyothermonth' },
                            { label: 'Custom', value: 'custom' },
                        ];
                    }
                    get WhenYearoptions() {
                        return [
                            { label: 'Specific Date', value: 'specificdate' },
                            { label: 'Relative Date', value: 'relativedate' }
                        ];
                    }
                    get WhenMnthoptions() {
                        return [
                            { label: 'Specific Days', value: 'specificdays' },
                            { label: 'Relative Days', value: 'relativedays' }
                        ];
                    }
                    
                    get everyoptions() {
                        return [
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' },
                            { label: '10', value: '10' },
                            { label: '11', value: '11' },
                            { label: '12', value: '12' },
                            { label: '13', value: '13' },
                            { label: '14', value: '14' },
                            { label: '15', value: '15' },
                            { label: '16', value: '16' },
                            { label: '17', value: '17' },
                            { label: '18', value: '18' },
                            { label: '19', value: '19' },
                            { label: '20', value: '20' },
                            { label: '21', value: '21' },
                            { label: '22', value: '22' },
                            { label: '23', value: '23' },
                            { label: '24', value: '24' },
                            { label: '25', value: '25' },
                            { label: '26', value: '26' },
                            { label: '27', value: '27' },
                            { label: '28', value: '28' },
                            { label: '29', value: '29' },
                            { label: '30', value: '30' },

                        ];
                    }

                    get Dayoptions() {
                        return [
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' },
                            { label: '10', value: '10' },
                            { label: '11', value: '11' },
                            { label: '12', value: '12' },
                            { label: '13', value: '13' },
                            { label: '14', value: '14' },
                            { label: '15', value: '15' },
                            { label: '16', value: '16' },
                            { label: '17', value: '17' },
                            { label: '18', value: '18' },
                            { label: '19', value: '19' },
                            { label: '20', value: '20' },
                            { label: '21', value: '21' },
                            { label: '22', value: '22' },
                            { label: '23', value: '23' },
                            { label: '24', value: '24' },
                            { label: '25', value: '25' },
                            { label: '26', value: '26' },
                            { label: '27', value: '27' },
                            { label: '28', value: '28' },
                            { label: '29', value: '29' },
                            { label: '30', value: '30' },
                            { label: '31', value: '31' },

                        ];
                    }
                    get redioOptions() {
                        return [
                            { label: 'Su', value: 'Su' },
                            


                        ];
                    }
                    get redioOptions1() {
                        return [
                            { label: 'M', value: 'M' },
                            


                        ];
                    }
                    get redioOptions2() {
                        return [
                            { label: 'T', value: 'T' },
                            


                        ];
                    }
                    get redioOptions3() {
                        return [
                            { label: 'W', value: 'W' },
                            


                        ];
                    }
                    get redioOptions4() {
                        return [
                            { label: 'Th', value: 'Th' },
                            


                        ];
                    }
                    get redioOptions5() {
                        return [
                            { label: 'F', value: 'F' },
                            


                        ];
                    }
                    get redioOptions6() {
                        return [
                            { label: 'Sa', value: 'Sa' },
                            


                        ];
                    }
                    get repeatOnMonth() {
                        return [
                            { label: 'Sunday', value: 'Sunday' },
                            { label: 'Monday', value: 'Monday' },
                            { label: 'Tuesday', value: 'Tuesday' },
                            { label: 'Wednesday', value: 'Wednesday' },
                            { label: 'Thursday', value: 'Thursday' },
                            { label: 'Friday', value: 'Friday' },
                            { label: 'Saturday', value: 'Saturday' },
                            { label: 'Day', value: 'Day' },



                        ];
                    }
                    get dayyear() {
                        return [
                            { label: 'First', value: 'First' },
                            { label: 'Second', value: 'Second' },
                            { label: 'Third', value: 'Third' },
                            { label: 'Fourth', value: 'Fourth' },
                            { label: 'Last', value: 'Last' }
                           

                        ];
                    }
                    get monthsName() {
                        return [
                            { label: 'January', value: 'January' },
                            { label: 'February', value: 'February' },
                            { label: 'March', value: 'March' },
                            { label: 'April', value: 'April' },
                            { label: 'May', value: 'May' },
                            { label: 'Jun', value: 'Jun' },
                            { label: 'July', value: 'July' },
                            { label: 'August', value: 'August' },
                            { label: 'September', value: 'September' },
                            { label: 'October', value: 'October' },
                            { label: 'November', value: 'November' },
                            { label: 'December', value: 'December' },

                            
                           

                        ];
                    }
                    
                    
                    
    fetchPriorityPicklist() {
                        getPriority()
                            .then(result => {
                                this.prioritylst = result;
                                for (let i = 0; i < this.prioritylst.length; i++) {
                                    this.priorityPicklist = [...this.priorityPicklist, { label: this.prioritylst[i], value: this.prioritylst[i] }];
                                }
                                this.error = undefined;
                            })
                            .catch(error => {
                                this.error = error;
                                this.account = undefined;
                            })
                        }
                        get priorityOptions() {
                            return this.priorityPicklist;
                        }     
    fetchTopicPicklist() {
                        getTopic()
                            .then(result => {
                                this.topiclst = result;
                                for (let i = 0; i < this.topiclst.length; i++) {
                                    this.topicPicklist = [...this.topicPicklist, { label: this.topiclst[i], value: this.topiclst[i] }];
                                }
                                this.error = undefined;
                            })
                            .catch(error => {
                                this.error = error;
                                this.account = undefined;
                            })
                        }
                        get topicOptions() {
                            return this.topicPicklist;
                        }  

                     

    
    lookupRecord(event){
        console.log('Id-'+event.detail.selectedRecord);
if(event.detail.selectedRecord){
        this.ownerId =event.detail.selectedRecord.Id;
        console.log('OwnerId-'+this.ownerId);
}

    }
    lookupRecord1(event){
        console.log('Id-'+event.detail.selectedRecord);
        if(event.detail.selectedRecord){

        this.contactId = (event.detail.selectedRecord.Id);
        console.log('contactId-'+this.contactId);
        }

    }
    @track reletedtoid;
    lookupRecord3(event){
        console.log('Id-'+event.detail.selectedRecord);
        if(event.detail.selectedRecord){
                this.reletedtoid =event.detail.selectedRecord.Id;
                console.log('related to id-'+this.reletedtoid);
        }else {
            this.reletedtoid =null;
            console.log('related to id-'+this.reletedtoid);

        }
    }

    
    @track typeSelected;
    @track approachSelected;
    @track contactId;
    @track topic;
    @track withwhomSelected;
    @track statusSelected;
    @track dateClosed;
    @track createRecurring;
    @track comments;
    @track prioritySelected;
    @track subject;
    @track dueDate;
    @track isDailySelected;
    @track isYearlySelected;
    @track isMonthlySelected;
    @track isWeeklySelected;
    @track seletedFrequency 
    @track repeatSelected;
    @track startDate;
    @track endDate;
    @track isShowEvery;
    @track everySelected;
    @track whenYearSelected;
    @track isShowRelativeDate;
    @track whenMonthSelected;
    @track isShowRelativeDay;

    @track repeatSelectedW;
    @track startDateW;
    @track endDateW;
    @track isShowEveryW;
    @track everySelectedW;
    @track repeatOnW;
    @track repeatOnw1;
    @track repeatOnw2;
    @track repeatOnw3;
    @track repeatOnw4;
    @track repeatOnw5;
    @track repeatOnw6;




    @track repeatSelectedM;
    @track startDateM;
    @track endDateM;
    @track isShowEveryM;
    @track everySelectedM;
    @track repeatOnM;
    @track dayMSelected;
    @track dayMTSelected;

    @track dayYSelected;
    @track repeatOnY;
     @track MonthSelected;
     @track startDateY;
    @track endDateY;
    @track wRepeatOnNo =0;



    handleWhenMonthChange(event) {
        this.isShowRelativeDay =false;
        this.whenMonthSelected = event.detail.value;
        console.log('whenMonthSelected-'+this.whenMonthSelected);
        if(this.whenMonthSelected =='relativedays'){

            this.isShowRelativeDay =true;
        }

    }
    handleDayMChange(event) {
        this.dayMselected = event.detail.value;
        console.log('dayMselected-'+this.dayMselected);
        

    }

    handleWhenYearChange(event) {
        this.isShowRelativeDate =false;
        this.whenYearSelected = event.detail.value;
        console.log('whenYearSelected-'+this.whenYearSelected);
        if(this.whenYearSelected =='relativedate'){

            this.isShowRelativeDate =true;
        }

    }

    handleTypeChange(event) {
        this.typeSelected = event.detail.value;
        console.log('typeSelected-'+this.typeSelected);

    }
    handleApproachChange(event) {
        this.approachSelected = event.detail.value;
        console.log('approachSelected-'+this.approachSelected);

    }
    
    handleTopicChange(event) {
        this.topic = event.detail.value;
        console.log('topic-'+this.topic);

    }
    handleWithwhomchChange(event) {
        this.withwhomSelected = event.detail.value;
        console.log('withwhomSelected-'+this.withwhomSelected);

    }

    handleStatusChange(event) {
        this.statusSelected = event.detail.value;
        console.log('statusSelected-'+this.statusSelected);

    }
    handelDateClosedchange(event) {
        this.dateClosed = event.detail.value;
        console.log('DateClosed-'+this.dateClosed);

    }
    handelRecurrringchange(event) {
        this.createRecurring = event.detail.checked;
        this.isDailySelected =this.createRecurring;
        console.log('CreateRecurring-'+this.createRecurring);
        if(this.createRecurring==true){
            this.isDisableDuedate =true;
            this.dueDate =null;
    
        }else{
            this.isDisableDuedate =false;
            this.dueDate =this.currentDate;;
            this.isDailySelected =false;
        this.isWeeklySelected =false;
        this.isMonthlySelected =false
        this.isYearlySelected =false;
        }
        
    }
    handelCommentschange(event) {
        this.comments = event.detail.value;
        console.log('Comments-'+this.comments);

    }
    handlePriorityChange(event) {
        this.prioritySelected = event.detail.value;
        console.log('prioritySelected-'+this.prioritySelected);

    }
    
    handelDueDatechange(event) {
        this.dueDate = event.detail.value;
        console.log('DueDate-'+this.dueDate);

    }

    dailyHandleClick (event) {
        this.isDailySelected =true;
        this.isWeeklySelected =false;
        this.isMonthlySelected =false
        this.isYearlySelected =false;
        this.seletedFrequency ='Daily';
        this.dbtn ='brand';
        this.wbtn ='Neutral';
        this.mbtn ='Neutral';
        this.ybtn ='Neutral';
    }
    weeklyHandleClick (event) {
        this.isDailySelected =false;
        this.isWeeklySelected =true;
        this.isMonthlySelected =false
        this.isYearlySelected =false;
                this.seletedFrequency ='Weekly';
                this.dbtn ='Neutral';
        this.wbtn ='brand';
        this.mbtn ='Neutral';
        this.ybtn ='Neutral';
    }
    monthlyHandleClick (event) {
        this.isDailySelected =false;
        this.isWeeklySelected =false;
        this.isMonthlySelected =true;
        this.isYearlySelected =false;
                this.seletedFrequency ='Monthly';
                this.dbtn ='Neutral';
        this.wbtn ='Neutral';
        this.mbtn ='brand';
        this.ybtn ='Neutral';
    }
    yearlyHandleClick (event) {
        this.isDailySelected =false;
        this.isWeeklySelected =false;
        this.isMonthlySelected =false
        this.isYearlySelected =true;
        this.seletedFrequency ='Yearly';
        this.dbtn ='Neutral';
        this.wbtn ='Neutral';
        this.mbtn ='Neutral';
        this.ybtn ='brand';
    }

    handleRepeatChange(event) {
        this.isShowEvery =false;

        this.repeatSelected = event.detail.value;
        console.log('repeatSelected-'+this.repeatSelected);
        if(this.repeatSelected =='custom'){
            this.isShowEvery =true;
        }

    }
    handelStartDatechange(event) {
        this.startDate = event.detail.value;
        console.log('startDate-'+this.startDate);

    }
    handelEndDatechange(event) {
        this.endDate = event.detail.value;
        console.log('endDate-'+this.endDate);

    }
    handleEveryChange(event){
        this.everySelected = event.detail.value;
        console.log('everySelected-'+this.everySelected);
    }
    handleRepeatWChange(event) {
        this.isShowEveryW =false;

        this.repeatSelectedW = event.detail.value;
        console.log('repeatSelectedW-'+this.repeatSelectedW);
        if(this.repeatSelectedW =='custom'){
            this.isShowEveryW =true;
        }

    }
    handelStartDateWchange(event) {
        this.startDateW = event.detail.value;
        console.log('startDateW-'+this.startDateW);

    }
    handelEndDatewchange(event) {
        this.endDateW = event.detail.value;
        console.log('endDateW-'+this.endDateW);

    }
    handleEveryWChange(event){
        this.everySelectedW = event.detail.value;
        console.log('everySelectedW-'+this.everySelectedW);
    }
    handelRepeatOnWchange(event){
        this.repeatOnW = event.detail.value;
        console.log('repeatOnW-'+this.repeatOnW);
    }
    handelRepeatOnWchange1(event){
        this.repeatOnW1 = event.detail.value;
        console.log('repeatOnW1-'+this.repeatOnW1);
    }
    handelRepeatOnWchange2(event){
        this.repeatOnW2 = event.detail.value;
        console.log('repeatOnW2-'+this.repeatOnW2);
    }
    handelRepeatOnWchange3(event){
        this.repeatOnW3 = event.detail.value;
        console.log('repeatOnW3-'+this.repeatOnW3);
    }
    handelRepeatOnWchange4(event){
        this.repeatOnW4 = event.detail.value;
        console.log('repeatOnW4-'+this.repeatOnW4);
    }
    handelRepeatOnWchange5(event){
        this.repeatOnW5 = event.detail.value;
        console.log('repeatOnW5-'+this.repeatOnW5);
    }
    handelRepeatOnWchange6(event){
        this.repeatOnW6 = event.detail.value;
        console.log('repeatOnW6-'+this.repeatOnW6);
    }

    handleRepeatMChange(event) {
        this.isShowEveryM =false;

        this.repeatSelectedM = event.detail.value;
        console.log('repeatSelectedM-'+this.repeatSelectedM);
        if(this.repeatSelectedM =='custom'){
            this.isShowEveryM =true;
        }

    }
    handelStartDateMchange(event) {
        this.startDateM = event.detail.value;
        console.log('startDateM-'+this.startDateM);

    }
    handelEndDateMchange(event) {
        this.endDateM = event.detail.value;
        console.log('endDateM-'+this.endDateM);

    }
    handleEveryMChange(event){
        this.everySelectedM = event.detail.value;
        console.log('everySelectedM-'+this.everySelectedM);
    }
    handelRepeatOnMchange(event){
        this.repeatOnM = event.detail.value;
        console.log('repeatOnM-'+this.repeatOnM);
    }
    handleDayMTChange(event){
        this.dayMTSelected = event.detail.value;
        console.log('dayMTSelected-'+this.dayMTSelected);
    }

    handleDayYChange(event){
        this.dayYSelected = event.detail.value;
        console.log('dayYSelected-'+this.dayYSelected);
    }
    handelRepeatOnYchange(event){
        this.repeatOnY = event.detail.value;
        console.log('repeatOnY-'+this.repeatOnY);
    }
    handleMonthNameChange(event){
        this.MonthSelected = event.detail.value;
        console.log('MonthSelected-'+this.MonthSelected);
    }

    handelStartDateYchange(event) {
        this.startDateY = event.detail.value;
        console.log('startDateY-'+this.startDateY);

    }
    handelEndDateYchange(event) {
        this.endDateY = event.detail.value;
        console.log('endDateY-'+this.endDateY);

    }

    createTaskRec() {

        console.log('repeatOnW'+this.repeatOnW);
        console.log('repeatOnW1'+this.repeatOnW1);
        console.log('repeatOnW2'+this.repeatOnW2);
        console.log('repeatOnW3'+this.repeatOnW3);

        if(this.repeatOnW ){
            this.wRepeatOnNo =1;
        }
        if(this.repeatOnW1 ){
            this.wRepeatOnNo =this.wRepeatOnNo +2;
        }
        if(this.repeatOnW2 ){
            this.wRepeatOnNo =this.wRepeatOnNo +4;
        }
        if(this.repeatOnW3 ){
            this.wRepeatOnNo =this.wRepeatOnNo +8;
        }
        if(this.repeatOnW4 ){
            this.wRepeatOnNo =this.wRepeatOnNo +16;
        }
        if(this.repeatOnW5){
            this.wRepeatOnNo =this.wRepeatOnNo +32;
        }
        if(this.repeatOnW6 ){
            this.wRepeatOnNo =this.wRepeatOnNo +64;
        }
console.log(this.wRepeatOnNo);
        var pass=
        {
            Frequency: this.seletedFrequency,
            RepeatD:this.repeatSelected,
            EveryD:this.everySelected,
            StartDateD:this.startDate,
            EndDateD:this.endDate,

            RepeatW:this.repeatSelectedW,
            EveryW:this.everySelectedW,
            StartDateW:this.startDateW,
            EndDateW:this.endDateW,
            RepeatOnW :this.wRepeatOnNo,

            RepeatM:this.repeatSelectedM,
            EveryM:this.everySelectedM,
            StartDateM:this.startDateM,
            EndDateM:this.endDateM,
            RepeatOnM :this.repeatOnM,
            WhenM : this.whenMonthSelected,
            DayM :  this.dayMselected,
            dayMT : this.dayMTSelected,

            WhenY :this.whenYearSelected,
            DayY :  this.dayYSelected,
            RepeatOnY :this.repeatOnY,
            MonthY :this.MonthSelected,
            StartDateY:this.startDateY,
            EndDateY:this.endDateY


        };

        console.log('subject-'+this.subject);

            if (this.subject == null || this.subject == '' || this.subject =='undefined' || this.contactId == null || this.contactId == '' || this.contactId =='undefined'  ) {
                alert('Required fields are missing');
            }
            if(!(this.recordId).startsWith('00Q')){
            if(this.reletedtoid =='undefined' || this.reletedtoid ==null){
                alert('Required fields are missing');

            }
        }else{
            this.reletedtoid =this.recordId;
        }

        if(this.isInputValid() &&  this.subject != null && this.subject != '' && this.contactId != null && this.contactId != ''){
            
        console.log('typeSelected-'+this.typeSelected);
        console.log('reletedtoid-'+this.reletedtoid);

        accountRecMethod({ t_whatId : this.reletedtoid,
                            t_ownerId : this.ownerId,
                            t_type : this.typeSelected,
                            t_approach :this.approachSelected,
                            t_name : this.contactId,
                            t_topic : this.topic,
                            t_withwhom : this.withwhomSelected,
                            t_status : this.statusSelected,
                            t_dateClosed : this.dateClosed,
                            t_createRecurring : this.createRecurring,
                            t_comments : this.comments,
                            t_priority : this.prioritySelected,
                            t_subject : this.subject,
                            t_dueDate :this.dueDate,
                            data :pass

                            })
            .then(result => {
                this.message = result;
                this.error = undefined;
                console.log("Sucess");
                
                this.handleNavigation();

            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
}


    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('lightning-input,lightning-combobox,lightning-dual-listbox');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
}