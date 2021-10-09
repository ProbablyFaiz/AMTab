enum GeneratorRange {
    TabFolder = 'TabFolderRange',
    MasterSheetTemplate = 'MasterSheetTemplateRange',
    OrchestratorTemplate = 'OrchestratorTemplateRange',
    BallotTemplate = 'BallotTemplateRange',
    CaptainsFormTemplate = 'CaptainsFormTemplateRange',
    TournamentName = 'TournamentNameRange',
    FirstPartyName = 'FirstPartyNameRange',
    CourtroomNames = 'CourtroomsInfoRange',
    RoundNames = 'RoundNamesRange',
    BallotsPerTrial = 'BallotsPerTrialRange',
}

interface ICourtroomInfo {
    name: string;
    bailiffEmails: string[];
}

interface ISetupContext {
    isValid: boolean;

    masterSpreadsheet: Spreadsheet;
    ballotTemplate: GoogleFile;
    captainsFormTemplate: GoogleFile;

    tabFolder: Folder;
    masterSheetTemplate: GoogleFile;
    orchestratorTemplate: GoogleFile;
    ballotBaseTemplate: GoogleFile;
    captainsFormBaseTemplate: GoogleFile;

    tournamentName: string;
    firstPartyName: string;
    courtroomsInfo: ICourtroomInfo[];
    roundNames: string[];
    ballotsPerTrial: number;
}

class SetupContext implements ISetupContext {
    masterSpreadsheet: Spreadsheet;
    ballotTemplate: GoogleFile;
    captainsFormTemplate: GoogleFile;

    private generatorSpreadsheet: Spreadsheet;

    constructor() {
        this.generatorSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    get isValid(): boolean {
        // noinspection UnnecessaryLocalVariableJS
        const tabFolderIsEmpty = !this.tabFolder.getFiles().hasNext();
        return tabFolderIsEmpty;
    }

    // @memoize
    // get masterSpreadsheet(): Spreadsheet {
    //
    // }
    //
    // set masterSpreadsheet(spreadsheet: Spreadsheet) {
    //
    // }

    @memoize
    get tabFolder(): Folder {
        return DriveApp.getFolderById(getIdFromUrl(this.getRangeValue(GeneratorRange.TabFolder)));
    }

    @memoize
    get masterSheetTemplate(): GoogleFile {
        return DriveApp.getFileById(getIdFromUrl(this.getRangeValue(GeneratorRange.MasterSheetTemplate)));
    }

    @memoize
    get orchestratorTemplate(): GoogleFile {
        return DriveApp.getFileById(getIdFromUrl(this.getRangeValue(GeneratorRange.OrchestratorTemplate)));
    }

    @memoize
    get ballotBaseTemplate(): GoogleFile {
        return DriveApp.getFileById(getIdFromUrl(this.getRangeValue(GeneratorRange.BallotTemplate)));
    }

    @memoize
    get captainsFormBaseTemplate(): GoogleFile {
        return DriveApp.getFileById(getIdFromUrl(this.getRangeValue(GeneratorRange.CaptainsFormTemplate)));
    }

    @memoize
    get tournamentName(): string {
        return this.getRangeValue(GeneratorRange.TournamentName);
    }

    @memoize
    get firstPartyName(): string {
        return this.getRangeValue(GeneratorRange.FirstPartyName);
    }

    @memoize
    get courtroomsInfo(): ICourtroomInfo[] {
        return compactRange(this.getRangeValues(GeneratorRange.CourtroomNames)).map(courtroomCells => {
            return {
                name: courtroomCells[0],
                bailiffEmails: courtroomCells[1].split(','),
            };
        });
    }

    @memoize
    get roundNames(): string[] {
        return compactRange(this.getRangeValues(GeneratorRange.RoundNames)).map(row => row[0]);
    }

    @memoize
    get ballotsPerTrial(): number {
        return parseInt(this.getRangeValue(GeneratorRange.BallotsPerTrial));
    }

    private getRangeValue(rangeName: GeneratorRange): string {
        return this.generatorSpreadsheet.getRangeByName(rangeName).getValue().toString();
    }

    private getRangeValues(rangeName: GeneratorRange): string[][] {
        return this.generatorSpreadsheet.getRangeByName(rangeName).getValues().map(arr => arr.map(cell => cell.toString()));
    }
}
