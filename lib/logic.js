/**
 * Setup the demo
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
	date.setDate(date.getDate() - 1277);
    student.dateReg = date;
    student.graduated = false;
    student.creditRequire = 124;

    //create teacher
    const teacher = factory.newResource(NS, 'teacher', 'teacher@email.com');
    teacher.firstName = 'teacher1';
    teacher.lastName = 'teacher';

    //contract
    const contract = factory.newResource(NS, 'contract', '26156');
    contract.credit = 3;
    contract.passed = false;
    contract.studentID = '26156';
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
 * Approve the credit if student pass on that subject
 * @param {org.acme.pii.creditApproval} creditApproval 
 * @transaction
 */

 async function creditApproval (creditApproval){

    const studentCredit = creditApproval.studentCredit;
    const contract = creditApproval.contract;
    if(contract.passed === true){
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
   
   if (studentCredit.credit && studentCredit.creditID === contract.studentID) {
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

 /**
 * Check at the end of year if student collect all credit require
 * @param {org.acme.pii.graduateCheck} graduateCheck 
 * @transaction
 */

 async function graduateCheck (graduateCheck){

    const studentCredit = graduateCheck.studentCredit;
    const student = graduateCheck.student;
    const date = graduateCheck.timeStamp
	date.setDate(date.getDate());
    if(studentCredit.creditCount >= student.creditRequire && studentCredit.creditID === student.studentID && student.dateReg <= date-1277){
        student.graduated = true;
        student.dateGrad = date;
    }
    

    const studentReg = await getParticipantRegistry('org.acme.pii.student');
    await studentReg.update(student);

 }

 
 

 /**
 * Create contarct when register on that subject
 * @param {org.acme.pii.createContract} createContract 
 * @transaction
 */
async function createContract (createContract){
    const factory = getFactory();
    const NS = 'org.acme.pii';

    const student = createContract.student;
    const teacher = createContract.teacher;

    const contract = factory.newResource(NS, 'contract', createContract.contractID);
    contract.studentID = student.studentID;
    contract.credit = createContract.credit;
    contract.passed = false;
    contract.student = factory.newRelationship(NS, 'student', student.studentID);
    contract.teacher = factory.newRelationship(NS, 'teacher', teacher.email);

    const contractReg = await getAssetRegistry(NS + '.contract');
    await contractReg.addAll([contract]);
}

