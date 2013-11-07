#MockMan

MockMan is a Node.js module that lets you easily create mocks, stubs and spies for use in testing your node application. 

## Installation
_Instructions coming soon_

## Usage
MockMan provides a simple interface for creating mock objets, which can then be injected into your tests.

    var mockman = require('mockman');

    var moduleMock = mockman.literal('SomeModule');

    // moduleMock::functionName should be called once and return a value
    moduleMock.shouldReceive('functionName').once().willReturn('some_value');
    
    // moduleMock::neverCalledFunction should not be called and return a value
    moduleMock.shouldReceive('neverCalledFunction').never().willReturn('another_value');
    