/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licensejk for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */
/*
/**
 * Sample transaction processor function.
 * @param {org.example.basic.SampleTransaction} tx The sample transaction instance.
 * @transaction
 
async function sampleTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
    
}
*/

/**
 * Sample transaction processor function.
 * @param {org.acme.pii.demoSetUp} demoSetUp 
 * @transaction
 */

 async function demoSetUp (demoSetUp){
    const factory = getFactory();
    const NS = 'org.acme.pii';

    //Create registrar
    let registrar = factory.newResource(NS, 'registrar', 'registrar@email.com');
    registrar.firstName = 'registrar1';
    registrar.lastName = 'registrar';

    //create student
    let student = factory.newResource(NS, 'student', studentCredit);
    student.email = 'student@email.com'
    student.firstName = 'Student1';
    student.lastName = 'student';

    //create teacher
    let teacher = factory.newResource(NS, 'teacher', 'teacher@email.com');
    teacher.firstName = 'teacher1';
    teacher.lastName = 'teacher';

    //contract
    let contract = factory.newResource(NS, 'contract', 26156);
    contract.credit = 3;
    contract.pass = false;
    contract.student = factory.newRelationship(NS, 'student', 26156);
    contract.teacher = factory.newRelationship(NS, 'teacher', 'teacher@email.com');

    //credit
    let studentCredit = factory.newResource(NS, 'studentCredit', 26156);
    studentCredit.student = factory.newRelationship(NS, 'student', 26156);


    //register
    let registrarReg = getParticipantRegistry(`${NS}registrar`);
    await registrarReg.add(registrar);
    await getParticipantRegistry(NS + 'student').add(student);
    await getParticipantRegistry(NS + 'teacher').add(teacher);
    await getParticipantRegistry(NS + 'studentCredit').add(studentCredit);
    await getParticipantRegistry(NS + 'contract').add(contract);

 }


