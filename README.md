#MockMan

MockMan is a Node.js module that lets you easily create mocks, stubs and spies for use in testing your node application. 

## Installation
_Instructions coming soon_

## Usage
MockMan provides a simple interface for creating mock objets, which can then be injected into your tests.

#### Setup
You will first need to require the module into your tests.

    var mockman = require('mockman');

#### Defining Assertions
To create a mock object and define some expectations on the methods that are or are not called, you can define these as follows:

    var moduleMock = mockman.literal('SomeModule');

    // moduleMock::functionName should be called once and return a value
    moduleMock.shouldReceive('functionName').once().willReturn('some_value');
    
    // moduleMock::neverCalledFunction should not be called and return a value
    moduleMock.shouldReceive('neverCalledFunction').never().willReturn('another_value');
    
Once you have defined your expectations, you will then need to generate the mock object which can be passed into your test.

    var mock = moduleMock.getMock();

#### Checking Assertions
To keep MockMan test suite agnostic, you must call the close method, which will evaluate each of the assertions made. Should this come across an error, for example a method called an unexpected number of times, it will trow an exception. It is recommended that you make this call in your tear down of each test. 

    mockman.close();

