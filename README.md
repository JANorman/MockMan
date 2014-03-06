#MockMan [![Build Status](https://travis-ci.org/JANorman/MockMan.png?branch=master)](https://travis-ci.org/JANorman/MockMan)

MockMan is a Node.js module that lets you easily create mocks, stubs and spies for use in testing your node application. 

## Installation
MockMan is available through NPM. To install, add it to your package.json as follows:
    "dependencies": {
        "mockman" : "*",
    }

Alternatively you can install it using the NPM CLI:
    npm install mockman


## Usage
MockMan provides a simple interface for creating mock objects, which can then be injected into your tests.

#### Setup
You will first need to require the module into your tests.

    var mockman = require('mockman');

#### Defining Assertions
MockMan can currently support generating mocks with the literal pattern, and the constructor pattern so they can be instantiated. Once you've defined which type of mock you would like, the pattern is the same for defining the method call assertions. 
	
##### Literal Pattern
    var moduleMock = mockman.literal('SomeModule');

##### Constructor Pattern
    var moduleMock = mockman.instance('SomeModule');

##### Defining Assertions

    // moduleMock::functionName should be called once and return a value
    moduleMock.shouldReceive('functionName').once().willReturn('some_value');
    
    // moduleMock::neverCalledFunction should not be called and return a value
    moduleMock.shouldReceive('neverCalledFunction').never().willReturn('another_value');


##### Method call counts
To define method call counts, a number of methods are available:
- any()
    - The method can be called any amount of times (0 or more)
- once()
    - The method should only be called once
- twice()
    - The method should only be twice
- times(x)
    - The method should be called the specific number of times defined
- never()
    - The method should never be called


##### Testing callbacks
If you make use of callbacks, it is quite often useful to simulate different callback return values in your tests. Consider the following callback pattern:

    Users.fetchAll(function(err, result) {
        if(err) {
            return false;
        }

        return result;
    }); 

To test this callback, you can use the "willExecuteCallback" method to control how the callback is executed. This method takes two parameters; the first is the argument number (zero-indexed) where the closure is, and the second is an array of parameters that should be passed to the closure. The following are examples of how you could test the above code:
    
    // Simulates a successful call of fetch
    UsersMock.shouldReceive('fetchAll').once().willExecuteCallback(0, [null, ['user1', 'user2', 'user3']]);

    // Simulates an unsuccessful fetch
    UsersMock.shouldReceive('fetchAll').once().willExecuteCallback(0, ['an error message', null]);


#### Using the mock objects
Once you have defined your expectations, you will then need to generate the mock object which can be passed into your test.

    var mock = moduleMock.getMock();

#### Checking Assertions
To keep MockMan test suite agnostic, you must call the close method, which will evaluate each of the assertions made. Should this come across an error, for example a method called an unexpected number of times, it will throw an exception. It is recommended that you make this call in your tear down of each test. 

    mockman.close();

## Licensing
MockMan is licensed under the MIT license. Details can be found in the LICENSE file. 
