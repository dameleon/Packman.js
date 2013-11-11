/** Packman.js : A javascript packager and class loader >> Author: damele0n@twitter Version: 0.0.1 Url: https://github.com/dameleon/Packman.js */
;(function(global) {
    var proto = '__proto__';
    var classes = {};
    var isArray = Array.isArray;

    function Packman(name, entities) {
        /** Stash properties */
        var constructor = entities.constructor;
        var modules = entities.modules;

        delete entities.constructor;
        delete entities.modules;

        /** Create constructor object */
        var Func = new Function('return function ' + name + '(c,m){this.modules=m;return c&&c.call(this)||this}')();

        (Func.prototype = entities).constructor = Func;

        /** Create package instance */
        var instance = new Func(constructor,modules);

        instance[proto][proto] = this[proto];
        instance.initPackage();
        return instance;
    }

    Packman.prototype = {
        constructor: Packman,
        createInstance: function(first) {
            var args = isArray(first) && first || [].slice.call(arguments);
            var name = args.shift();
            var klass = classes[name];
            var callers = new CallerHandler();

            if (!klass) {
                throw new Error('Undefined module: ' + name);
            }
            args.unshift(this);
            return (new klass(args, callers));
        },
        initPackage: function() {
            var modules = this.modules || [];
            var len = modules.length;
            var args, name;

            for (var i = 0; i < len; i++) {
                args = modules[i];
                name = (isArray(args) && args[0] || args);

                if (this[name]) {
                    continue;
                } else {
                    this[name] = this.createInstance(args);
                }
            }
        },
        loadModule: function(args, callers) {
            var caller, name;

            if (isArray(args)) {
                name = args.shift();
            } else {
                name = args;
                args = [];
            }

            if (this[name]) {
                return this[name];
            } else if ((caller = callers.getByName(name))) {
                return caller;
            } else {
                var klass = classes[name];

                if (!klass) {
                    throw new Error('Undefined module: ' + name);
                }
                args.unshift(this);
                return this[name] = new klass(args, callers);
            }
        }
    };


    function LoadClass(name, entities) {
        if (classes[name]) {
            throw new Error('Duplicate class name: ' + name);
        }
        var constructor = entities.constructor;
        var modules = entities.modules;
        var inherit = entities.inherit;

        delete entities.constructor;
        delete entities.modules;
        delete entities.inherit;

        entities.__initClass = initClass;
        classes[name] = new Function(
            'c', 'm', 'i', 'e',
            'function '+name+'(args,callers){this.context=args.shift();this.modules=m;this.inherit=i;callers.add(this);this.__initClass(callers);c&&c.apply(this,args)};('+name+'.prototype=e).constructor='+name+';return '+name
        )(constructor, modules, inherit, entities);
    }

    function initClass(callers) {
        var context = this.context;
        var modules = this.modules;
        var inherit = this.inherit;

        if (modules) {
            for (var i = 0, module; module = modules[i]; i++) {
                this[module] = context.loadModule(module, callers);
            }
        }
        if (inherit) {
            this[proto][proto] = this.__super__ = context.loadModule(inherit, callers);
        }
        return this;
    }


    function CallerHandler() {
        this.list = [];
        return this;
    }

    CallerHandler.prototype = {
        constructor: CallerHandler,
        add: function(caller) {
            var list = this.list;
            var index = list.indexOf(caller);

            if (index === -1) {
                list[list.length] = caller;
            }
        },
        getByName: function(name) {
            var list = this.list;

            for (var i = 0, val; val = list[i]; i++) {
                console.log(val, val.constructor.name, name);
                if (val.constructor.name === name) {
                    return val;
                }
            }
            return null;
        }
    };


    global.Packman = Packman;
    global.LoadClass = LoadClass;

})(this.self || global);
