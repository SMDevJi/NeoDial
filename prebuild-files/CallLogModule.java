package com.anonymous.NeoDial;

import android.database.Cursor;

import android.content.ContentValues;
import android.net.Uri;
import android.provider.CallLog;

import android.provider.ContactsContract;
import android.content.ContentProviderOperation;
import java.util.ArrayList;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CallLogModule extends ReactContextBaseJavaModule {

  ReactApplicationContext reactContext;

  public CallLogModule(ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
  }

  @Override
  public String getName() {
    return "CallLogModule";
  }

  /**
   * Update call log entry
   */
  @ReactMethod
  public void updateCallLog(
    String id,
    String number,
    String type, // INCOMING/OUTGOING/MISSED/REJECTED
    String duration,
    double timestamp,
    String name,
    String simId,
    Promise promise
  ) {
    try {
      ContentValues values = new ContentValues();

      if (number != null) values.put(CallLog.Calls.NUMBER, number);
      if (duration != null) values.put(CallLog.Calls.DURATION, duration);
      if (timestamp > 0) values.put(CallLog.Calls.DATE, (long) timestamp);

      int typeInt = 2; // default OUTGOING
      if ("INCOMING".equalsIgnoreCase(type)) typeInt = 1;
      else if ("OUTGOING".equalsIgnoreCase(type)) typeInt = 2;
      else if ("MISSED".equalsIgnoreCase(type)) typeInt = 3;
      else if ("REJECTED".equalsIgnoreCase(type)) typeInt = 5;
      values.put(CallLog.Calls.TYPE, typeInt);

      if (name != null) values.put(CallLog.Calls.CACHED_NAME, name);
      if (simId != null) values.put(CallLog.Calls.PHONE_ACCOUNT_ID, simId);

      Uri uri = CallLog.Calls.CONTENT_URI;
      int rowsUpdated = reactContext.getContentResolver().update(
        uri,
        values,
        CallLog.Calls._ID + "=?",
        new String[] {
          id
        }
      );

      promise.resolve(rowsUpdated);
    } catch (Exception e) {
      promise.reject("UPDATE_FAILED", e);
    }
  }

  /**
   * Add new call log entry
   */
  @ReactMethod
  public void addCallLog(
    String number,
    String type, // INCOMING / OUTGOING / MISSED / REJECTED
    String duration,
    double timestamp,
    String name,
    String simId,
    Promise promise
  ) {
    try {
      ContentValues values = new ContentValues();

      // Required fields
      values.put(CallLog.Calls.NUMBER, number);
      values.put(CallLog.Calls.DATE, (long) timestamp);
      values.put(CallLog.Calls.DURATION, duration != null ? duration : "0");

      int typeInt = 2; // default OUTGOING
      if ("INCOMING".equalsIgnoreCase(type)) typeInt = 1;
      else if ("OUTGOING".equalsIgnoreCase(type)) typeInt = 2;
      else if ("MISSED".equalsIgnoreCase(type)) typeInt = 3;
      else if ("REJECTED".equalsIgnoreCase(type)) typeInt = 5;
      values.put(CallLog.Calls.TYPE, typeInt);

      if (name != null) values.put(CallLog.Calls.CACHED_NAME, name);
      if (simId != null) values.put(CallLog.Calls.PHONE_ACCOUNT_ID, simId);

      Uri uri = CallLog.Calls.CONTENT_URI;
      Uri newUri = reactContext.getContentResolver().insert(uri, values);

      if (newUri != null) {
        promise.resolve(newUri.getLastPathSegment());
      } else {
        promise.reject("ADD_FAILED", "Failed to insert call log");
      }

    } catch (Exception e) {
      promise.reject("ADD_FAILED", e);
    }
  }

  @ReactMethod
  public void deleteCallLog(
    String id,
    Promise promise
  ) {
    try {
      int rowsDeleted = reactContext.getContentResolver().delete(
        CallLog.Calls.CONTENT_URI,
        CallLog.Calls._ID + "=?",
        new String[] {
          id
        }
      );

      promise.resolve(rowsDeleted);

    } catch (Exception e) {
      promise.reject("DELETE_FAILED", e);
    }
  }

  @ReactMethod
  public void createContactIfNotExists(
    String name,
    String number,
    Promise promise
  ) {
    try {
      if (name == null || name.isEmpty()) {
        promise.resolve(false);
        return;
      }

      // 1. Check if contact already exists
      Cursor cursor = reactContext.getContentResolver().query(
        ContactsContract.PhoneLookup.CONTENT_FILTER_URI.buildUpon()
        .appendPath(number).build(),
        null,
        null,
        null,
        null
      );

      if (cursor != null && cursor.getCount() > 0) {
        cursor.close();
        promise.resolve(false); // already exists
        return;
      }

      if (cursor != null) cursor.close();

      // 2. Create new contact
      ArrayList < ContentProviderOperation > ops = new ArrayList < > ();

      ops.add(ContentProviderOperation.newInsert(
          ContactsContract.RawContacts.CONTENT_URI)
        .withValue(ContactsContract.RawContacts.ACCOUNT_TYPE, null)
        .withValue(ContactsContract.RawContacts.ACCOUNT_NAME, null)
        .build()
      );

      // Name
      ops.add(ContentProviderOperation.newInsert(
          ContactsContract.Data.CONTENT_URI)
        .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
        .withValue(ContactsContract.Data.MIMETYPE,
          ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
        .withValue(ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME, name)
        .build()
      );

      // Phone
      ops.add(ContentProviderOperation.newInsert(
          ContactsContract.Data.CONTENT_URI)
        .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
        .withValue(ContactsContract.Data.MIMETYPE,
          ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
        .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER, number)
        .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
          ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE)
        .build()
      );

      reactContext.getContentResolver().applyBatch(
        ContactsContract.AUTHORITY,
        ops
      );

      promise.resolve(true);

    } catch (Exception e) {
      promise.reject("CONTACT_CREATE_FAILED", e);
    }
  }
}