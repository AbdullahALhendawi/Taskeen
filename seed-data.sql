-- Mock data for Taskeen presentation.
-- Builds: 2 buildings -> 2 floors -> 2 apartments -> 2 rooms -> 2 beds each (32 beds total),
-- 24 residents assigned to beds, 8 beds left vacant to demo the empty state.
-- Run against the TaskeenDb database (see instructions at the bottom).

SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;

DECLARE @Buildings TABLE (Id UNIQUEIDENTIFIER, Name NVARCHAR(200));
DECLARE @Floors TABLE (Id UNIQUEIDENTIFIER, BuildingId UNIQUEIDENTIFIER, FloorNumber INT);
DECLARE @Apartments TABLE (Id UNIQUEIDENTIFIER, FloorId UNIQUEIDENTIFIER, ApartmentNumber INT);
DECLARE @Rooms TABLE (Id UNIQUEIDENTIFIER, ApartmentId UNIQUEIDENTIFIER, RoomNumber INT);
DECLARE @Beds TABLE (Id UNIQUEIDENTIFIER, RoomId UNIQUEIDENTIFIER, BedNumber INT, Seq INT IDENTITY(1,1));
DECLARE @Residents TABLE (Id UNIQUEIDENTIFIER, Seq INT IDENTITY(1,1));

-- Buildings
INSERT INTO Buildings (Id, Name, CreatedAt)
OUTPUT inserted.Id, inserted.Name INTO @Buildings
VALUES
    (NEWID(), N'المبنى الأول', GETUTCDATE()),
    (NEWID(), N'المبنى الثاني', GETUTCDATE());

-- Floors (2 per building)
INSERT INTO Floors (Id, FloorNumber, BuildingId)
OUTPUT inserted.Id, inserted.BuildingId, inserted.FloorNumber INTO @Floors
SELECT NEWID(), f.FloorNumber, b.Id
FROM @Buildings b
CROSS JOIN (VALUES (1), (2)) AS f(FloorNumber);

-- Apartments (2 per floor)
INSERT INTO Apartments (Id, ApartmentNumber, FloorId)
OUTPUT inserted.Id, inserted.FloorId, inserted.ApartmentNumber INTO @Apartments
SELECT NEWID(), a.ApartmentNumber, fl.Id
FROM @Floors fl
CROSS JOIN (VALUES (1), (2)) AS a(ApartmentNumber);

-- Rooms (2 per apartment)
INSERT INTO Rooms (Id, RoomNumber, ApartmentId)
OUTPUT inserted.Id, inserted.ApartmentId, inserted.RoomNumber INTO @Rooms
SELECT NEWID(), r.RoomNumber, ap.Id
FROM @Apartments ap
CROSS JOIN (VALUES (1), (2)) AS r(RoomNumber);

-- Beds (2 per room)
INSERT INTO Beds (Id, BedNumber, RoomId)
OUTPUT inserted.Id, inserted.RoomId, inserted.BedNumber INTO @Beds (Id, RoomId, BedNumber)
SELECT NEWID(), bd.BedNumber, rm.Id
FROM @Rooms rm
CROSS JOIN (VALUES (1), (2)) AS bd(BedNumber);

-- Residents (24 people, mixed nationalities/trades typical of labor housing)
INSERT INTO Residents (Id, EmployeeId, FullName, Phone, Nationality, JobTitle)
OUTPUT inserted.Id INTO @Residents (Id)
VALUES
    (NEWID(), N'EMP-1001', N'Muhammad Aslam',        N'+966501234501', N'Pakistan',    N'Electrician'),
    (NEWID(), N'EMP-1002', N'Rajesh Kumar',           N'+966501234502', N'India',       N'Plumber'),
    (NEWID(), N'EMP-1003', N'Ahmed Hassan',           N'+966501234503', N'Egypt',       N'Supervisor'),
    (NEWID(), N'EMP-1004', N'Md. Rafiqul Islam',      N'+966501234504', N'Bangladesh',  N'Laborer'),
    (NEWID(), N'EMP-1005', N'Juan Dela Cruz',         N'+966501234505', N'Philippines', N'Carpenter'),
    (NEWID(), N'EMP-1006', N'Suresh Bahadur',         N'+966501234506', N'Nepal',       N'Welder'),
    (NEWID(), N'EMP-1007', N'Ibrahim Suleiman',       N'+966501234507', N'Sudan',       N'Driver'),
    (NEWID(), N'EMP-1008', N'Faisal Mahmood',         N'+966501234508', N'Pakistan',    N'Technician'),
    (NEWID(), N'EMP-1009', N'Anil Gupta',             N'+966501234509', N'India',       N'Mason'),
    (NEWID(), N'EMP-1010', N'Karim Abdallah',         N'+966501234510', N'Egypt',       N'Cook'),
    (NEWID(), N'EMP-1011', N'Nasir Uddin',            N'+966501234511', N'Bangladesh',  N'Cleaner'),
    (NEWID(), N'EMP-1012', N'Ramon Santos',           N'+966501234512', N'Philippines', N'Foreman'),
    (NEWID(), N'EMP-1013', N'Bikash Thapa',           N'+966501234513', N'Nepal',       N'Laborer'),
    (NEWID(), N'EMP-1014', N'Yusuf Adam',             N'+966501234514', N'Sudan',       N'Security Guard'),
    (NEWID(), N'EMP-1015', N'Waqar Ahmed',            N'+966501234515', N'Pakistan',    N'HVAC Technician'),
    (NEWID(), N'EMP-1016', N'Sanjay Verma',           N'+966501234516', N'India',       N'Painter'),
    (NEWID(), N'EMP-1017', N'Omar Fathi',             N'+966501234517', N'Egypt',       N'Storekeeper'),
    (NEWID(), N'EMP-1018', N'Habibur Rahman',         N'+966501234518', N'Bangladesh',  N'Rigger'),
    (NEWID(), N'EMP-1019', N'Mark Villanueva',        N'+966501234519', N'Philippines', N'Scaffolder'),
    (NEWID(), N'EMP-1020', N'Prakash Rai',            N'+966501234520', N'Nepal',       N'Helper'),
    (NEWID(), N'EMP-1021', N'Tariq Javed',            N'+966501234521', N'Pakistan',    N'Site Engineer'),
    (NEWID(), N'EMP-1022', N'Vikram Singh',           N'+966501234522', N'India',       N'Surveyor'),
    (NEWID(), N'EMP-1023', N'Mostafa Kamal',          N'+966501234523', N'Egypt',       N'Foreman'),
    (NEWID(), N'EMP-1024', N'Abdul Karim',            N'+966501234524', N'Bangladesh',  N'Laborer');

-- Assign the 24 residents to the first 24 beds (by insertion order), leaving 8 beds vacant
UPDATE bd
SET bd.ResidentId = r.Id
FROM Beds bd
JOIN @Beds b ON b.Id = bd.Id
JOIN @Residents r ON r.Seq = b.Seq
WHERE b.Seq <= 24;
