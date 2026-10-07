Feature: MDTG conversion
  Convert dates to military date-time groups and parse them back.

  Scenario: Format an extended MDTG in UTC
    Given I have the UTC date "2024-08-12T11:55:30.000Z"
    When I format it as "extended" MDTG in timezone "Z"
    Then the MDTG value should be "12115530Zaug24"

  Scenario: Format and parse an MDTG in a local timezone
    Given I have the UTC date "2024-08-12T11:55:30.000Z"
    When I format it as "standard" MDTG in timezone "A"
    Then the MDTG value should be "121255Aaug24"
    When I parse the MDTG value
    Then the UTC date should be "2024-08-12T11:55:00.000Z"

  Scenario: Reject an invalid calendar date
    Given I have the MDTG value "310224Zfeb24"
    When I parse the MDTG value
    Then parsing should fail with a RangeError
