CREATE TABLE [dbo].[tblCustomers] (
    [customerId] INT IDENTITY (1, 1) NOT NULL,
    [code] NVARCHAR (10) NULL,
    [DoctorName] NVARCHAR (100) NULL,
    [VisitCategory] NVARCHAR (10) NULL,
    [Specialty] NVARCHAR (100) NULL,
    [DoctorUniqueCode] INT NULL,
    mobile NVARCHAR (20) NULL,
    email NVARCHAR (20) NULL,
    CENTRENAME NVARCHAR (100) NULL,
    Address1 NVARCHAR (500) NULL,
    Address2 NVARCHAR (200) NULL,
    LocalArea NVARCHAR (200) NULL,
    City NVARCHAR (200) NULL,
    StateID int null,
    PinCode NVARCHAR (20) NULL,
    ChemistMapped NVARCHAR (200) NULL,
    isDisabled int default 0,
    CreatedDate smallDateTime default GETDATE() CONSTRAINT [PK_tblCustomers] PRIMARY KEY CLUSTERED ([customerId] ASC)
);

--
-------------------------------
-- CREATED BY: GURU SINGH
-- CREATED DATE: 26-NOV-2022
-------------------------------
CREATE PROCEDURE USP_DELETE_CUSTSOMER (@customerId INT) AS
SET
    NOCOUNT ON;

BEGIN -- UPDATE
UPDATE
    tblCustomers
SET
    isDisabled = 1
where
    customerId = @customerId
END
SET
    NOCOUNT OFF;

GO
    ----
    -------------------------------
    -- CREATED BY: GURU SINGH
    -- CREATED DATE: 26-NOV-2022
    -------------------------------
    CREATE PROCEDURE USP_GET_CUSTSOMER_DETAILS_BY_ID (@customerId INT) AS
SET
    NOCOUNT ON;

BEGIN
SELECT
    *
FROM
    tblCustomers
WHERE
    customerId = @customerId
END
SET
    NOCOUNT OFF;

GO
    --
    -------------------------------
    -- CREATED BY: GURU SINGH
    -- CREATED DATE: 26-NOV-2022
    -------------------------------
    CREATE PROCEDURE USP_GET_CUSTSOMER_LIST (@customerId INT) AS
SET
    NOCOUNT ON;

BEGIN
SELECT
    *
FROM
    tblCustomers
ORDER BY
    customerId DESC
END
SET
    NOCOUNT OFF;

GO