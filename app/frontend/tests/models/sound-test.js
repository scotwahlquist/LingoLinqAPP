import DS from 'ember-data';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  waitsFor,
  runs,
  stub
} from 'frontend/tests/helpers/jasmine';
import { } from 'frontend/tests/helpers/ember_helper';
import LingoLinqAAC from '../../app';

describe('Sound', function() {
  describe("filename", function() {
    it("should not error on empty value", function() {
      var sound = LingoLinqAAC.store.createRecord('sound', {});
      expect(sound.get('filename')).toEqual('sound');
    });
    it("should return filename if found in URL path, ignoring query params", function() {
      var sound = LingoLinqAAC.store.createRecord('sound', {url: 'http://www.sounds.com/sound.wav'});
      expect(sound.get('filename')).toEqual('sound.wav');
      sound.set('url', 'http://www.sounds.com/sound.mp3?id=1234');
      expect(sound.get('filename')).toEqual('sound.mp3');
      sound.set('url', 'http://www.sounds.com/sound.php?id=3456');
      expect(sound.get('filename')).toEqual('sound');
    });
    it("should provide readable string for data URIs", function() {
      var sound = LingoLinqAAC.store.createRecord('sound', {url: 'data:audio/wav;abababa'});
      expect(sound.get('filename')).toEqual('embedded sound');
    });
  });
  it("should automatically check for locally-stored data-uri on load", function() {
    var sound = LingoLinqAAC.store.createRecord('sound', {});
    sound.didLoad();
    expect(sound.get('checked_for_data_url')).toEqual(true);
  });

  describe("extension", function() {
    it('should return the correct value', function() {
      var sound = LingoLinqAAC.store.createRecord('sound', {});
      expect(sound.get('extension')).toEqual('unknown type');
      sound.set('content_type', 'audio/mpeg');
      expect(sound.get('extension')).toEqual('mp3');
      sound.set('content_type', 'audio/ogg');
      expect(sound.get('extension')).toEqual('oga');
      sound.set('content_type', 'audio/bacon');
      expect(sound.get('extension')).toEqual('unknown type');
      sound.set('url', 'http://www.example.com/sound.mp3?a=b&c=2');
      expect(sound.get('extension')).toEqual('mp3');
      sound.set('url', 'http://www.example.com/sound?a=b&c=2');
      expect(sound.get('extension')).toEqual('unknown type');
    });
  });
});
