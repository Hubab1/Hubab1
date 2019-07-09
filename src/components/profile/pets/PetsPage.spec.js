import { petsSchema } from './PetsPage';

describe('petsSchema', function() {
    it('must have a pet type', function(){
        expect(()=>petsSchema.validateSync({petOptions: [{name: 'doggy', weight: '5kg', breed: 'pit bull'}]})).toThrow();
    })
    describe('when pet_type=Dog', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: '5', breed: 'pit bull'}]})).not.toThrow();
        })
        it('throws when weight is not a numeric value', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 'thiccc', breed: 'pit bull'}]})).toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: '5'}]})).toThrow();
        })
    })
    describe('when pet_type=Cat', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Cat', name: 'catty', weight: '5'}]})).not.toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Cat', weight: '5'}]})).toThrow();
        })
    })
    describe('when pet_type=Other', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Other', description: 'a beautiful hamster'}]})).not.toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema.validateSync({petOptions: [{pet_type: 'Other'}]})).toThrow();
        })
    })
});