/**
 * Sample transaction processor function.
 * @param {org.acme.pii.demoSetUp} demoSetUp 
 * @transaction
 */

async function demoSetUp (demoSetUp){
    const factory = getFactory();
    const NS = 'org.acme.pii';

    //Create registrar
    const registrar = factory.newResource(NS, 'registrar', 'registrar@email.com');
    registrar.firstName = 'registrar1';
    registrar.lastName = 'registrar';

    //create student
    const student = factory.newResource(NS, 'student', '26156');
    student.email = 'student@email.com'
    student.firstName = 'Student1';
    student.lastName = 'student';
    const date = demoSetUp.timestamp
	date.setDate(date.getDate() + 1);
   	student.dateReg = date;

    //create teacher
    const teacher = factory.newResource(NS, 'teacher', 'teacher@email.com');
    teacher.firstName = 'teacher1';
    teacher.lastName = 'teacher';

    //contract
    const contract = factory.newResource(NS, 'contract', '26156');
    contract.credit = 3;
    contract.passed = false;
    contract.checked = false;
    contract.student = factory.newRelationship(NS, 'student', '26156');
    contract.teacher = factory.newRelationship(NS, 'teacher', 'teacher@email.com');
   
    //credit
    const studentCredit = factory.newResource(NS, 'studentCredit', '26156');
    studentCredit.student = factory.newRelationship(NS, 'student', '26156');
    studentCredit.creditCount = 0;
    //studentCredit.credit = [];


    //register
    const registrarReg = await getParticipantRegistry(NS + '.registrar');
    await registrarReg.addAll([registrar]);

   	const studentReg = await getParticipantRegistry(NS + '.student');
    await studentReg.addAll([student]);

    const teacherReg = await getParticipantRegistry(NS + '.teacher');
    await teacherReg.addAll([teacher]);

    const studentCreditReg = await getAssetRegistry(NS + '.studentCredit');
    await studentCreditReg.addAll([studentCredit]);

    const contractReg = await getAssetRegistry(NS + '.contract');
    await contractReg.addAll([contract]);

 }



/**
 * Sample transaction processor function.
 * @param {org.acme.pii.creditApproval} creditApproval 
 * @transaction
 */

 async function creditApproval (creditApproval){

    const studentCredit = creditApproval.studentCredit;
    const contract = creditApproval.contract;
    if(contract.passed === true || contract.checked === true){
        //return 'Error';
    }
    else {
    contract.passed = true;

    /*
    if (studentCredit.credit) {
        studentCredit.credit.push({
            credit: contract.credit,
            timestamp: creditApproval.timestamp
        });
    } else {
        studentCredit.credit = [{
            credit: contract.credit,
            timestamp: creditApproval.timestamp
        }];
    }
    */
   if (studentCredit.credit) {
        studentCredit.credit.push(3);
    } else {
        studentCredit.credit = [3];
    }
    studentCredit.creditCount = studentCredit.creditCount+3;



    const contractReg = await getAssetRegistry('org.acme.pii.contract');
    await contractReg.update(contract);

    const studentCreditReg = await getAssetRegistry('org.acme.pii.studentCredit');
    await studentCreditReg.update(studentCredit);

    }



 }
 


