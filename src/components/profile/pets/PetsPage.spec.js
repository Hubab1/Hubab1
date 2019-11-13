import { petsSchema } from './PetsPage';

describe('petsSchema', function() {
    const defaultConfig = {
        petMaxWeight: Infinity
    };
    it('must have a pet type', function(){
        expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{name: 'doggy', weight: '5kg', breed: 'pit bull'}]})).toThrow();
    })
    describe('when pet_type=Dog', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 5, breed: 'pit bull'}]})).not.toThrow();
        })
        it('throws when weight is not a numeric value', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 'thiccc', breed: 'pit bull'}]})).toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 5}]})).toThrow();
        })
    })
    describe('when pet_type=Cat', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Cat', name: 'catty', weight: 5}]})).not.toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Cat', weight: 5}]})).toThrow();
        })
    })
    describe('when pet_type=Other', function() {
        it('validates successfully when all fields present', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Other', description: 'a beautiful hamster'}]})).not.toThrow();
        })
        it('throws when a field is missing', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Other'}]})).toThrow();
        })
    })
    describe('Max weight validation', function() {
        it('validates successfully when weight does not exceed max', function(){
            expect(()=>petsSchema(defaultConfig).validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 5, breed: 'pit bull'}]})).not.toThrow();
        })
        it('throws when weight exceeds max', function(){
            expect(()=>petsSchema({petMaxWeight: 100}).validateSync({petOptions: [{pet_type: 'Dog', name: 'doggy', weight: 200, breed: 'pit bull'}]})).toThrow();
        })
    })
});