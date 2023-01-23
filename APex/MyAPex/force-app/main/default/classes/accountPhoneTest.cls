/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
@isTest
public class accountPhoneTest {
    @IsTest
    Public static void testMethodName() {
        account aa = new Account(Name='Test Accoiutn', Phone='34234');
        insert aa;
        Contact testContact1 = new Contact(FirstName='Test', LastName='Contact', Phone='555-555-5555', AccountId=aa.Id);
        insert testContact1;
        
        aa.Phone = '1111111111';
        update aa;

        Map<id,account> oldAccMap = new Map<id,account>();
        oldAccMap.put(aa.Id, [SELECT Phone FROM Account WHERE Id =: aa.Id]);
        Test.startTest();
            AccountClass.Method(new List<Account>{aa},oldAccMap);
        Test.stopTest();

        System.assertEquals(testContact1.Phone, aa.Phone);
    }
    
}
