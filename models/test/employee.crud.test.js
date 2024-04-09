const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
    before(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
        } catch (err) {
            console.error(err);
        }
    });

    after(() => {
        mongoose.models = {};
    });

    describe('Reading data', () => {
        before(async () => {
            const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
            await empOne.save();
        
            const empTwo = new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'HR' });
            await empTwo.save();
        });
        
        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
        });
        
        it('should return proper document by various params with "findOne" method', async () => {
            const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe' });
            expect(employee.firstName).to.be.equal('John');
            expect(employee.lastName).to.be.equal('Doe');
        });
      
        after(async () => {
            await Employee.deleteMany();
        });

    });

    describe('Creating data', () => {
        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Updating data', () => {
        beforeEach(async () => {
            const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
            await empOne.save();
          
            const empTwo = new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'HR' });
            await empTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'John', lastName: 'Doe' }, { $set: { firstName: 'Johnny' }});
            const updatedEmployee = await Employee.findOne({ firstName: 'Johnny', lastName: 'Doe' });
            expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update one document with "save" method', async () => {
            const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe' });
            employee.firstName = 'Johnny';
            await employee.save();

            const updatedEmployee = await Employee.findOne({ firstName: 'Johnny', lastName: 'Doe' });
            expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, { $set: { department: 'Management' }});
            const employees = await Employee.find({ department: 'Management' });
            expect(employees.length).to.be.equal(2);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Removing data', () => {
        beforeEach(async () => {
            const empOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
            await empOne.save();
          
            const empTwo = new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'HR' });
            await empTwo.save();
        });

        it('should properly remove one document with "deleteOne" method', async () => {
            await Employee.deleteOne({ firstName: 'John', lastName: 'Doe' });
            const removeEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Doe' });
            expect(removeEmployee).to.be.null;
        });

        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
    });

});