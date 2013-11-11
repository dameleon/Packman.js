Packman.js
==========

A simple packager and class loader for JavaScript.

```
// Usage

//// Define Class
LoadClass('HogeClass', {
    constructor: function() {
        
    },
    someMethod: function() {
        
    }
});


// Autoload
LoadClass('FugaClass', {
    modules: [
        'HogeClass',
        // call with arguments
        ['PiyoClass', arg1, arg2]
    ],
    constructor: function() {
        this.HogeClass.someMethod(); // -> Alias for this.context.HogeClass
        this.PiyoClass.someMethod(); // -> Alias for this.context.PiyoClass
    }
});


//// Create new instance at local
LoadClass('PiyoClass', {
    constructor: function() {
        this.localHogeClass = this.context.createInstance('HogeClass', arg1, arg2);
    },
    someMethod: function() {
        this.localHogeClass.someMethod();     
    }
});


//// Inherit
LoadClass('FooClass', {
    inherit: 'HogeClass',
    constructor: function() {
        // overridden method

        // call base method
        this.__super__.someMethod();
    }
});


//// All
LoadClass('AllSampleClass', {
    inherit: 'HogeClass',
    modules: [
        'FugaClass', 
        'PiyoClass', 
    ],
    constructor: function() {
        this.loadlFooClass = this.context.createInstance('FooClass', arg1, arg2);
    }
});



//// Create package
var pkg = Packman('Package', {
    modules: [
        'AllSampleClass' // -> To load HogeClass, FugaClass, PiyoClass 
    ],
    constructor: function() {
        // you can call method of HogeClass, because HogeClass loaded at AllSampleClass. 
        this.HogeClass.someMethod();
    }
});

```
