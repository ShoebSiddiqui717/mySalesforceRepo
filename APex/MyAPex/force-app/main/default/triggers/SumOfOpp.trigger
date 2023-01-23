/**
 * @description       : Opp Amount Sum on account field
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-13-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
trigger SumOfOpp on Opportunity (after insert,after Update,after delete,after undelete) {
    Switch on Trigger.OperationType{
        When After_insert{
            OppClass.method(trigger.new);
        }
        When After_Update{
            oppClass.method2(trigger.new,trigger.oldMap);
        }
        When after_Delete{
            oppclass.method3(trigger.oldMap);
        }
        When After_Undelete{
            oppClass.method4(trigger.new);
        }
    }
}