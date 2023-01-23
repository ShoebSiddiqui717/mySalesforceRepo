/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-13-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class OppClass {
    public static void OppClass(List<Opportunity> OppNewList) {
        set<id> accIds = new set<id> ();
        for (Opportunity eNewOpp : OppNewList){
            accIds.add(eNewOpp.AccountId);
        }

        list<aggregateResult> Result = [select accountid, sum(amount) oppSUM from Opportunity where AccountId in : accIds 
                                        group by AccountId];

        map<id,integer> OppSumMap = new Map<id,Integer> ();
        for (aggregateResult each : Result) {
            integer sum =(Integer)each.get('oppSUM');
            string id = (id) each.get('accountid');
            OppSumMap.put(id,sum);
        }
    }
}