const Employee = require('../employee.model.js');
const expect = require('chai').expect;

describe('Employee', () => {
    
    it('should throw an error if no "firstName" arg', async () => {
        const emp = new Employee({ lastName: 'Doe', department: 'IT' });
        emp.validateSync(err => {
            expect(err.errors.firstName).to.exist;
        });
    });

    it('should throw an error if no "lastName" arg', async () => {
        const emp = new Employee({ firstName: 'John', department: 'IT' });
        emp.validateSync(err => {
            expect(err.errors.lastName).to.exist;
        });
    });

    it('should throw an error if no "department" arg', async () => {
        const emp = new Employee({ firstName: 'John', lastName: 'Doe' });
        emp.validateSync(err => {
            expect(err.errors.department).to.exist;
        });
    });

    it('should throw an error if "department" is not a string', () => {
        const cases = [{}, [], 123];
        for (let department of cases) {
            const emp = new Employee({ firstName: 'John', lastName: 'Doe', department });
            emp.validateSync(err => {
                expect(err.errors.department).to.exist;
            });
        }
    });

    it('should not throw an error if "firstName", "lastName", and "department" are provided', () => {
        const emp = new Employee({ firstName: 'John', lastName: 'Doe', department: 'IT' });
        emp.validateSync(err => {
            expect(err).to.not.exist;
        });
    });
    
});