/**
 * Setup the demo
 * @param {org.acme.pii.demoSetUp} demoSetUp 
 * @transaction
 */

async function demoSetUp (demoSetUp){
    const factory = getFactory();
    const NS = 'org.acme.pii';

    //create adminRegistrar
    const adminRegistrar = factory.newResource(NS, 'adminRegistrar', 'adminRegistrar@email.com')
    adminRegistrar.firstName = 'Adminregistrar1';
    adminRegistrar.lastName = 'Adminregistrar';


    //Create registrar
    const registrar = factory.newResource(NS, 'registrar', 'registrar@email.com');
    registrar.firstName = 'registrar1';
    registrar.lastName = 'registrar';

    //create student
    const student = factory.newResource(NS, 'student', '26156');
    student.email = 'student@email.com'
    student.firstName = 'Student';
    student.lastName = 'student';
    const date = demoSetUp.timestamp
	date.setDate(date.getDate() - 1277);
    student.dateReg = date;
    student.graduated = false;
    student.creditCount = 0;
    student.creditRequire = 124;

    const student1 = factory.newResource(NS, 'student', '4309');
    student1.email = 'student1@email.com'
    student1.firstName = 'Student1';
    student1.lastName = 'student1';
    student1.dateReg = date;
    student1.graduated = false;
    student1.creditCount = 0;
    student1.creditRequire = 150;



    //create teacher
    const teacher = factory.newResource(NS, 'teacher', 'teacher@email.com');
    teacher.firstName = 'teacher';
    teacher.lastName = 'teacher';

    const teacher1 = factory.newResource(NS, 'teacher', 'teacher1@email.com');
    teacher1.firstName = 'teacher1';
    teacher1.lastName = 'teacher1';

    //contract
    const contract = factory.newResource(NS, 'contract', '1234');
    contract.credit = 3;
    contract.status = 'ONGOING';
    contract.studentID = '26156';
    contract.student = factory.newRelationship(NS, 'student', '26156');
    contract.teacher = factory.newRelationship(NS, 'teacher', 'teacher@email.com');

    const contract1 = factory.newResource(NS, 'contract', '9999');
    contract1.credit = 10;
    contract1.status = 'ONGOING';
    contract1.studentID = '4309';
    contract1.student = factory.newRelationship(NS, 'student', '4309');
    contract1.teacher = factory.newRelationship(NS, 'teacher', 'teacher1@email.com');
    /*
    //credit
    const studentCredit = factory.newResource(NS, 'studentCredit', '26156');
    studentCredit.student = factory.newRelationship(NS, 'student', '26156');
    studentCredit.creditCount = 0;
    //studentCredit.credit = [];
    */


    //register
    const adminRegistrarReg = await getParticipantRegistry(NS + '.adminRegistrar');
    await adminRegistrarReg.addAll([adminRegistrar]);

    const registrarReg = await getParticipantRegistry(NS + '.registrar');
    await registrarReg.addAll([registrar]);

   	const studentReg = await getParticipantRegistry(NS + '.student');
    await studentReg.addAll([student, student1]);

    const teacherReg = await getParticipantRegistry(NS + '.teacher');
    await teacherReg.addAll([teacher, teacher1]);

    /*
    const studentCreditReg = await getAssetRegistry(NS + '.studentCredit');
    await studentCreditReg.addAll([studentCredit]);
    */

    const contractReg = await getAssetRegistry(NS + '.contract');
    await contractReg.addAll([contract, contract1]);

 }



/**
 * Approve the credit if student pass on that subject
 * @param {org.acme.pii.creditApproval} creditApproval 
 * @transaction
 */

 async function creditApproval (creditApproval){

    const student = creditApproval.student;
    const contract = creditApproval.contract;
    if(contract.status === 'PASSED'){
        //return 'Error';
    }
    else {
    contract.status = 'PASSED';

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
   
    //&& student.studentID == contract.studentID
    //if(student.studentID == contract.studentID)
   if (student.credit && student.studentID == contract.student.studentID) {
        student.credit.push(contract.credit);
        student.creditCount = student.creditCount+contract.credit;
    } else if(student.studentID == contract.student.studentID) {
        student.credit = [contract.credit];
        student.creditCount = student.creditCount+contract.credit;
    }
    



    const contractReg = await getAssetRegistry('org.acme.pii.contract');
    await contractReg.update(contract);

    const studentReg = await getParticipantRegistry('org.acme.pii.student');
    await studentReg.update(student);

    }

 }

 /**
 * Check at the end of year if student collect all credit require
 * @param {org.acme.pii.graduateCheck} graduateCheck 
 * @transaction
 */

 async function graduateCheck (graduateCheck){

    const student = graduateCheck.student;
    const date = graduateCheck.timeStamp
    date.setDate(date.getDate());
    //&& student.studentID == student.studentID
    if(student.creditCount >= student.creditRequire  && student.dateReg <= date-1277){
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
    contract.status = 'ONGOING';
    contract.student = factory.newRelationship(NS, 'student', student.studentID);
    contract.teacher = factory.newRelationship(NS, 'teacher', teacher.email);

    const contractReg = await getAssetRegistry(NS + '.contract');
    await contractReg.addAll([contract]);
}



 /**
 * admin can Delete contract 
 * @param {org.acme.pii.deleteContract} deleteContract 
 * @transaction
 */

 async function deleteContract (deleteContract){
    const factory = getFactory();
    const NS = 'org.acme.pii';
    const contract = deleteContract.contract;

    const contractDel = await getAssetRegistry(NS + '.contract');
    contractDel.remove(contract);

 }