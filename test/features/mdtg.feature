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

  Scenario: Format a short MDTG without month or year
    Given I have the UTC date "2024-08-12T11:55:30.000Z"
    When I format it as "short" MDTG in timezone "Z"
    Then the MDTG value should be "121155Z"

  Scenario: Parse a short MDTG using a reference date
    Given I have the reference date "2024-08-01T00:00:00.000Z"
    And I have the MDTG value "121155Z"
    When I parse the MDTG value
    Then the UTC date should be "2024-08-12T11:55:00.000Z"

  Scenario Outline: Apply timezone offsets across UTC date boundaries
    Given I have the UTC date "<date>"
    When I format it as "extended" MDTG in timezone "<timezone>"
    Then the MDTG value should be "<value>"
    When I parse the MDTG value
    Then the UTC date should be "<date>"

    Examples:
      | date                     | timezone | value          |
      | 2024-01-01T00:15:30.000Z | A        | 01011530Ajan24 |
      | 2024-12-31T23:45:30.000Z | X        | 31124530Xdec24 |

  Scenario: Distinguish structural format from semantic validity
    Given I have the MDTG value "310224Zfeb24"
    Then the MDTG value should be structurally valid
    And the MDTG value should be semantically invalid

  Scenario Outline: Reject invalid times
    Given I have the MDTG value "<value>"
    When I parse the MDTG value
    Then parsing should fail with a RangeError

    Examples:
      | value          |
      | 126155Zaug24   |
      | 12156030Zaug24 |
